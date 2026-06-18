# 0089 Daily Schedule Spacing And Contrast

## Request

- Remove the `24` hour label from daily schedule PM clock labels.
- Improve the Day schedule parameter UI background because the current panel is hard to read.
- Add a control for the distance between AM/PM circles: horizontal distance in landscape layouts and vertical distance in portrait layouts.

## Resolution

- Daily schedule clock labels now render AM `0`-`11` and PM `12`-`23`; no `24` text layer is generated.
- Day schedule settings use a higher-contrast nested panel and editor background based on app theme variables.
- Added `dailyCircleGap` generator setting and UI slider. The generator applies it to the AM/PM circle edge gap horizontally in landscape layouts and vertically in portrait layouts.

## Validation

- `npm test`
- `npm run build`
- Browser runtime gate and production deployment are recorded in `docs/test-plan.md` and QCDS docs after validation.
