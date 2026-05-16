# Safety And Moderation Plan

Starry Echo is anonymous but not unaccountable. The product should preserve emotional safety while keeping enough backend traceability to protect users.

## Required Controls

- Anonymous display names only in the client.
- Stable backend `uid` for abuse prevention and moderation.
- Report/block on every bottle and reply surface.
- Per-user send and reply rate limits.
- Duplicate content and spam detection.
- Moderation queue for reported content.
- Device/IP risk signals kept server-side only.

## Crisis Handling

The app must detect content that suggests self-harm, imminent harm, abuse, or emergency distress.

When detected:

- Do not frame AI as a therapist or emergency responder.
- Show supportive language and encourage contacting local emergency services or trusted people.
- Escalate the item into a moderation queue.
- Avoid sending the bottle randomly to untrained strangers if the content is high risk.

## AI Lighthouse Rules

- Trigger only after 24 hours without a human reply.
- Identify the reply as AI-generated.
- Keep the tone supportive and non-clinical.
- Never provide diagnosis, legal advice, medical advice, or manipulative reassurance.
- Log prompt version, model version, safety result, and generated reply id.

## Store Policy Notes

- User-generated content apps need reporting, blocking, and moderation.
- Paid virtual kindness must avoid misleading odds, gambling mechanics, or pressure tactics.
- White noise must be user-controlled and not start unexpectedly.
