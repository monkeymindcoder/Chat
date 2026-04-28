# Security Specification for Nexus Chat (1:1)

## Data Invariants
1. A conversation must have exactly 2 participants (if 1:1) or include the AI.
2. A message can only be added to a conversation by one of its participants.
3. Users can only see conversations where their `uid` is in the `participants` list.
4. User profiles are readable by all authenticated users to allow discovery/searching.

## The "Dirty Dozen" Payloads
1. **Eavesdropping**: Try to read messages from a `conversationId` where the user is not a participant.
2. **Conversation Hijack**: Try to add a message to a private chat between two other users.
3. **Identity Spoofing**: Send a message in a private chat but set `userId` to the other participant's ID.
4. **Invalid Participant**: Create a conversation with 3 participants instead of 2.
5. **Shadow Update**: Try to change the `participants` of an existing conversation to include oneself.
6. **PII Leak**: Try to read another user's private info (if we had any, currently just public profiles).
7. **Orphaned Message**: Create a message in a non-existent conversation.
8. **Malicious Metadata**: Update `lastMessage` of a conversation without sending an actual message.
9. **Spam**: Send messages with 1MB of text.
10. **ID Poisoning**: Use a 2KB junk string as a `conversationId`.
11. **Future Sync**: Set `updatedAt` to a future time.
12. **Self-Promotion**: Try to modify another user's profile `displayName`.
