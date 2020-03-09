import Pomodoro from "./../models/Pomodoro";

it("cycles through intervals as expected", () => {
  const pomodoro = new Pomodoro(() => {
    /* noop */
  });
  expect(pomodoro.currentState).toBe("start");
  pomodoro.finish();
  expect(pomodoro.currentState).toBe("workSession");
  pomodoro.finish();
  expect(pomodoro.currentState).toBe("shortBreak");
  pomodoro.finish();
  expect(pomodoro.currentState).toBe("workSession");
  pomodoro.finish();
  expect(pomodoro.currentState).toBe("shortBreak");
  pomodoro.finish();
  expect(pomodoro.currentState).toBe("workSession");
  pomodoro.finish();
  expect(pomodoro.currentState).toBe("shortBreak");
  pomodoro.finish();
  expect(pomodoro.currentState).toBe("workSession");
  pomodoro.finish();
  expect(pomodoro.currentState).toBe("longBreak");
});
