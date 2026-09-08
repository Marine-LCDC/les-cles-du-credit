/** Statuts donnant accès à l'espace agent. */
export const AGENT_ACCESS_STATUSES = [
  "active",
  "trialing",
  "past_due",
] as const;

export type AgentAccessStatus = (typeof AGENT_ACCESS_STATUSES)[number];

export function hasAgentAccess(status: string | null | undefined): boolean {
  return (
    !!status &&
    (AGENT_ACCESS_STATUSES as readonly string[]).includes(status)
  );
}
