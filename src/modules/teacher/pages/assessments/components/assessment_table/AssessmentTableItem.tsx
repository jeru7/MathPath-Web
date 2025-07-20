import { type ReactElement } from "react";
import Banner1 from "../../../../../../assets/images/section-banners/Banner_1.jpg";
import Banner2 from "../../../../../../assets/images/section-banners/Banner_2.jpg";
import Banner3 from "../../../../../../assets/images/section-banners/Banner_3.jpg";
import { FaCircle } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

export default function AssessmentTableItem(): ReactElement {
  return (
    <tr className="w-full font-medium hover:bg-gray-100 hover:cursor-pointer">
      {/* Title */}
      <td className="w-[30%]">
        <div className="truncate whitespace-nowrap overflow-hidden max-w-[400px]">
          Quiz 1:
          fhkasjdfhkshdafjghjkdsafkhasdkjfhkjsdahfhasdkfhkashdfkhkasjddhfkjsa
        </div>{" "}
      </td>
      {/* Topic */}
      <td className="w-[30%]">
        <div className="truncate whitespace-nowrap overflow-hidden max-w-[400px]">
          Addition
          fhkajdsgkfljhasdlkjfgjkadshfjkahsdfjkhasdkfjjksdhfkkasjdhfasdjkfhd
        </div>
      </td>
      {/* Section */}
      <td className="w-[15%]">
        <div className="flex gap-2">
          <img
            src={Banner1}
            alt="Section banner."
            className="rounded-sm w-8 h-5"
          />
          <img
            src={Banner2}
            alt="Section banner."
            className="rounded-sm  w-8 h-5"
          />
          <img
            src={Banner3}
            alt="Section banner."
            className="rounded-sm w-8 h-5"
          />
          <img
            src={Banner3}
            alt="Section banner."
            className="rounded-sm w-8 h-5"
          />
          <img
            src={Banner3}
            alt="Section banner."
            className="rounded-sm w-8 h-5"
          />
        </div>
      </td>
      {/* Status */}
      <td className="w-[10%]">
        <div className="py-1 px-4 flex items-center justify-center border border-[var(--primary-yellow)] h-fit w-fit rounded-full gap-2">
          <FaCircle className="text-[var(--primary-yellow)]" />
          <p className="text-sm text-[var(--primary-yellow)]">In Progress</p>
        </div>
      </td>
      {/* Deadline */}
      <td className="w-[10%]">May 13, 2025</td>
      <td className="w-[5%]">
        <button className="hover:scale-110 hover:cursor-pointer">
          <HiDotsVertical />
        </button>
      </td>
    </tr>
  );
}
