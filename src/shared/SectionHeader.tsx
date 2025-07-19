
import type { FC } from "react";

type SectionHeaderProps = {
  title: string;
};

const SectionHeader: FC<SectionHeaderProps> = ({ title }) => {
  return (
    <h2 className="text-2xl font-semibold text-left w-full max-w-md mb-1 mt-4">
      {title}
    </h2>
  );
};

export default SectionHeader;
