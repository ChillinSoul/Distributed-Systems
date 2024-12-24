export class Time {
  hours: number;
  minutes: number;
  
  constructor(hours: number, minutes: number) {
    this.hours = hours;
    this.minutes = minutes;
  }

  static fromString(s: string) {
    const [hours, minutes] = s.split("h");
    return new Time(+hours, +minutes);
  }

  toString() {
    return this.hours.toString() + "h" + this.minutes.toString();
  }
  
  add(time: Time) {
    this.minutes += time.minutes;
    if (this.minutes >= 60) {
      this.hours += 1;
      this.minutes -= 60;
    }
    this.hours += time.hours;
    if (this.hours >= 24) {
      this.hours -= 24;
    }
  }

  remove(time: Time) {
    this.minutes -= time.minutes;
    if (this.minutes <= 0) {
      this.hours -= 1;
      this.minutes += 60;
    }
    this.hours -= time.hours;
    if (this.hours >= 24) {
      this.hours -= 24;
    }
  }
}
