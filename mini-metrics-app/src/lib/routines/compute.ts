import "server-only";
import prisma from "../db/client";
import { fetchAllVideos } from "../api/camera/fetch";
import { FormulaWithResults } from "../db/formula";
import { Time } from "../time";

// type Results = {
//   [name: string]: string | string[];
// }

class Computation {
  finish: boolean;
  formula: FormulaWithResults | null;

  constructor(finish: boolean, formula: FormulaWithResults | null) {
    this.finish = finish;
    this.formula = formula
  }
}

export async function compute(formula: FormulaWithResults) {
  let isFinished = false;
  const start = Time.fromString(formula.beginAt ? formula.beginAt : "0h0");
  const end = Time.fromString(formula.endAt ? formula.endAt : "23h59");
  let lastTime;
  if (formula.results.length > 0) {
    const lastResult = formula.results.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[formula.results.length-1];
    lastTime = new Date(lastResult.createdAt);
  } else {
    lastTime = new Date(formula.createdAt);
  }

  const startOfDay = new Date(lastTime);
  startOfDay.setHours(start.hours, start.minutes, 0, 0);
  console.log("Start: "+ startOfDay);
  
  const isTooEarly = lastTime.getTime() < startOfDay.getTime();
  console.log(isTooEarly);
  if (isTooEarly) {
    lastTime = new Date(
      lastTime.getFullYear(),
      lastTime.getMonth(),
      lastTime.getDate(),
      start.hours,
      start.minutes
    )
  }
  const endOfDay = new Date(lastTime);
  endOfDay.setHours(end.hours, end.minutes, 0, 0);
  console.log("End: " + endOfDay);
  
  const isTooLate = lastTime.getTime() >= endOfDay.getTime();
  console.log(isTooLate);
  if (isTooLate) {
    lastTime = new Date(
      lastTime.getFullYear(),
      lastTime.getMonth(),
      lastTime.getDate()+1,
      start.hours,
      start.minutes
    )
  }
  
  // Assuming we have periods expressed in minutes
  const period = formula.period ? +formula.period : 1;
  const time = new Date(lastTime);
  time.setMinutes(time.getMinutes() + period);
  // Verify if we try to get a "future" result
  if (time.getTime() >= Date.now()) {
    return new Computation(true, formula);
  }
  // if (formula.endAt) {
  //   const endAt = new Date("1970T"+formula.endAt);
  // }
  
  // This assume we test it only on the same day it occurs
  const endTime = new Date(lastTime);
  
  if (formula.endAt) {
    const end = Time.fromString(formula.endAt);
    endTime.setHours(end.hours, end.minutes);
  } else {
    endTime.setHours(0, 0);
    endTime.setDate(endTime.getDate()+1);
  }
  
  let stringLeft = formula.formula;

  let count = false;
  let updatedFormula: FormulaWithResults | null = null;
  while (stringLeft) {
    const splittedString = stringLeft.split(" ", 1);
    const command = splittedString[0];

    switch (command) {
      case "num":
        count = true;
        break;
      case "cars":
        if (count) {
          const videos = await fetchAllVideos();
          const cars = videos.filter((value) =>
            value.typevehicule === "car"
            && lastTime < value.createat
            && value.createat < time
          );
          const result = cars.length;
          const creationTime = new Date(time);

          updatedFormula = await prisma.formula.update({
            where: {
              id: formula.id,
            },
            data: {
              results: {
                create: {
                  result: result,
                  type: "number",
                  createdAt: creationTime,
                }
              }
            },
            include: {
              results: true,
            }
          });
          isFinished =
            creationTime.getTime() + period*60000 >= Date.now()
            // lastTime.getTime() + period*60000 >= Date.now() ||
            // lastTime.getTime() + period*60000 >= endTime.getTime();
        }
        break;
      default:
        break;
    }

    stringLeft = stringLeft.slice(command.length).trimStart();
  }
  return new Computation(isFinished, updatedFormula);
}
