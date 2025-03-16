import { type ReactElement } from "react";

export default function About(): ReactElement {
  return (
    <section className="font-jersey flex h-fit w-screen items-center pb-24 text-[var(--primary-white)]">
      <div className="flex flex-col items-center gap-8 px-8">
        <h3 className="text-7xl">About</h3>
        <p className="text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          hendrerit tellus sit amet turpis dignissim, eu eleifend mi aliquet.
          Nullam pulvinar vestibulum erat, in porttitor orci egestas ac. Class
          aptent taciti sociosqu ad litora torquent per conubia nostra, per
          inceptos himenaeos. Curabitur auctor feugiat dolor, vitae suscipit
          elit varius ac. Pellentesque vel dui leo. Suspendisse nec libero a
          erat ullamcorper commodo. Nulla viverra, ante in convallis consequat,
          nisi tellus congue tortor, ut ultrices dui risus vitae metus. Mauris
          posuere placerat ornare. Etiam aliquam dolor in interdum elementum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. Fusce molestie vestibulum purus sit amet fermentum. Nam nec
          arcu ut turpis auctor condimentum eget a metus. Nam fringilla lacus
          diam.
        </p>
      </div>
    </section>
  );
}
