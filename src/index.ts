export * as Sub from "./sub";
export * as Hello from "./hello/world";

export const hello = (name: string): string => {
  const params = {
    hoge: 1,
    fuga: 2,
  };
  return `Hello ${name} ${JSON.stringify(params)}`;
};

console.log(hello("Your name"));
