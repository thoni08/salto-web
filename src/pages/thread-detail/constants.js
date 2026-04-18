export const buttonFx =
  "transition-[background-color,color,border-color,transform,filter,box-shadow] duration-150 ease-out hover:brightness-95 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-like-blue)/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export const darkButtonFx =
  "transition-[background-color,color,border-color,transform,filter,box-shadow] duration-150 ease-out hover:brightness-110 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-light-blue) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-dark)";

export const linkFx =
  "rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-like-blue)/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function preventPlaceholderClick(event) {
  event.preventDefault();
}
