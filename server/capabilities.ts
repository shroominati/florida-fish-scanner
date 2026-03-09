import type { CapabilityDefinition } from './types';

export const capabilityRegistry: CapabilityDefinition[] = [
  {
    id: 'compat.ping',
    requiresApproval: false,
    description: 'Read-only compatibility check.'
  },
  {
    id: 'approval.echo',
    requiresApproval: true,
    description: 'Approval-bound example capability used for grant and bypass tests.'
  }
];

export function getCapability(capabilityId: string): CapabilityDefinition | undefined {
  return capabilityRegistry.find((capability) => capability.id === capabilityId);
}
