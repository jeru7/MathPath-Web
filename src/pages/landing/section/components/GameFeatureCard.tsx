import { type ReactElement } from "react";

interface IGameFeatureCard {
  className?: string;
  imgSrc: string;
  title: string;
  description: string;
}

const GameFeatureCard: React.FC<IGameFeatureCard> = ({
  className,
  imgSrc,
  title,
  description,
}: IGameFeatureCard): ReactElement => {
  return (
    <div className={'flex h-screen items-center justify-center gap-2 text-[var(--primary-white)] ' + className}>
      <img src={imgSrc} alt={title} className="h-auto w-full rounded-lg" />
      <p className="text-2xl font-semibold">{title}</p>
      <p className="text-xl text-gray-400">{description}</p>
    </div>
  );
};

export default GameFeatureCard;
