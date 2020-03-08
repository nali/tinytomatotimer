import Pomodoro from "../Pomodoro";

it("cycles through intervals as expected", () => {
  const pomodoro = new Pomodoro();
  expect(pomodoro.currentState).toBe("start");
  pomodoro.next();
  expect(pomodoro.currentState).toBe("workSession");
  pomodoro.next();
  expect(pomodoro.currentState).toBe("shortBreak");
  pomodoro.next();
  expect(pomodoro.currentState).toBe("workSession");
  pomodoro.next();
  expect(pomodoro.currentState).toBe("shortBreak");
  pomodoro.next();
  expect(pomodoro.currentState).toBe("workSession");
  pomodoro.next();
  expect(pomodoro.currentState).toBe("shortBreak");
  pomodoro.next();
  expect(pomodoro.currentState).toBe("workSession");
  pomodoro.next();
  expect(pomodoro.currentState).toBe("longBreak");
});
