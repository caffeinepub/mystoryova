import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";
import { getSecretParameter } from "../utils/urlParams";
import { useInternetIdentity } from "./useInternetIdentity";

const ACTOR_QUERY_KEY = "actor";

// Ping the canister with a real query until it responds (handles cold/idle state).
async function pingUntilReady(actor: backendInterface): Promise<void> {
  const MAX_ATTEMPTS = 20;
  let delay = 2000;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await actor.getAllBooks();
      return;
    } catch {
      if (attempt === MAX_ATTEMPTS) return; // give up silently, let the call fail naturally
      await new Promise((res) => setTimeout(res, delay));
      delay = Math.min(delay * 1.5, 10000);
    }
  }
}

export function useActor() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery<backendInterface>({
    queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;

      let actor: backendInterface;
      if (!isAuthenticated) {
        actor = await createActorWithConfig();
      } else {
        const actorOptions = { agentOptions: { identity } };
        actor = await createActorWithConfig(actorOptions);
        const adminToken = getSecretParameter("caffeineAdminToken") || "";
        await actor._initializeAccessControlWithSecret(adminToken);
      }

      // Verify the canister is actually reachable before returning the actor.
      // This prevents login failures on cold canister starts.
      await pingUntilReady(actor);

      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: true,
    retry: 3,
    retryDelay: 3000,
  });

  useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => !query.queryKey.includes(ACTOR_QUERY_KEY),
      });
      queryClient.refetchQueries({
        predicate: (query) => !query.queryKey.includes(ACTOR_QUERY_KEY),
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
  };
}
