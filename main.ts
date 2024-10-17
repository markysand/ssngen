import { Command } from "jsr:@cliffy/command@1.0.0-rc.7";
import { format, subYears } from "npm:date-fns@4.1.0";

function randomInt(n: number) {
  return Math.floor(Math.random() * (n + 1));
}

function luhnDouble(n: number): number {
  let val = n * 2;

  if (val > 9) {
    val -= 9;
  }

  return val;
}

export function getLuhn(payload: string): number {
  return (
    (10 -
      (payload
        .split("")
        .reverse()
        .reduce((acc, val, index) => {
          const n = index % 2 === 0 ? luhnDouble(+val) : +val;

          acc += n;

          return acc;
        }, 0) %
        10)) %
    10
  );
}

new Command()
  .name("ssngen")
  .description("Generates safe ssn-s for testing.")
  .version("0.0.0")
  .option("-c --child", "<13yrs")
  .option("-a --adult", ">=13yrs")
  .option("-t --teen", "13-18yrs")
  .option("-f --female", "female")
  .option("-m --male", "male")
  .option("--min <years:number>", "min age", { default: 0 })
  .option("--max <years:number>", "max age", { default: 100 })
  .option("--age <years:number>", "exact age")
  .action(({ child, max, min, adult, age, female, male, teen }) => {
    const now = new Date();

    let personAge;

    if (age !== undefined) {
      personAge = age;
    } else {
      if (adult) {
        min = 18;
        max = 100;
      } else if (child) {
        min = 0;
        max = 13;
      } else if (teen) {
        min = 13;
        max = 18;
      }
      personAge = min + Math.random() * (max - min);
    }

    const birthDateString = format(subYears(now, personAge), "yyyyMMdd");

    const region = (98 + randomInt(1)).toString();

    let gender = randomInt(4) * 2;
    if (male) {
      gender += 1;
    } else if (!female) {
      gender += randomInt(1);
    }

    const payload = `${birthDateString}${region}${gender}`;

    const luhn = getLuhn(payload.substring(2));

    console.log(`${birthDateString}-${region}${gender}${luhn}`);
  })
  .parse(Deno.args);
