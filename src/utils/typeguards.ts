export function isBeforeInstallPrompt(
  event: Event
): event is BeforeInstallPromptEvent {
  return "userChoice" in event;
}
