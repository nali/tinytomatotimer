import Pomodoro from "./../models/Pomodoro";

it("cycles through intervals as expected", () => {
  const pomodoro = new Pomodoro(() => {
    /* noop */
  });
  expect(pomodoro.currentInterval.type).toBe("workSession");
  pomodoro.finish();
  expect(pomodoro.currentInterval.type).toBe("shortBreak");
  pomodoro.finish();
  expect(pomodoro.currentInterval.type).toBe("workSession");
  pomodoro.finish();
  expect(pomodoro.currentInterval.type).toBe("shortBreak");
  pomodoro.finish();
  expect(pomodoro.currentInterval.type).toBe("workSession");
  pomodoro.finish();
  expect(pomodoro.currentInterval.type).toBe("shortBreak");
  pomodoro.finish();
  expect(pomodoro.currentInterval.type).toBe("workSession");
  pomodoro.finish();
  expect(pomodoro.currentInterval.type).toBe("longBreak");
});
