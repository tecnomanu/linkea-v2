import { SegmentedSelect } from "@/Components/ui/SegmentedSelect";
import { HeaderSize, LinkBlock } from "@/types";
import React from "react";

interface HeaderConfigProps {
    link: LinkBlock;
    onUpdate: (id: string, updates: Partial<LinkBlock>) => void;
}

export const HeaderConfig: React.FC<HeaderConfigProps> = ({
    link,
    onUpdate,
}) => {
    return (
        <SegmentedSelect
            label="Header Size"
            value={link.headerSize || "medium"}
            options={[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" },
            ]}
            onChange={(val) =>
                onUpdate(link.id, {
                    headerSize: val as HeaderSize,
                })
            }
            uppercase
        />
    );
};

