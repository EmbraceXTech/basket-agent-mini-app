import useStepperStore from "@/stores/createAgent.store";
import { RadioGroup, Radio, cn, RadioProps, Textarea } from "@heroui/react";
import { useEffect } from "react";
import FormHeader from "./FormHeader";

interface CustomRadioProps extends RadioProps {
  children: React.ReactNode;
  iconPath?: string;
}

export const CustomRadio = (props: CustomRadioProps) => {
  const { children, description, iconPath, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "flex m-0 bg-content1 hover:bg-content2 items-center justify-between flex-1",
          "flex-row-reverse cursor-pointer rounded-lg gap-4 p-4 border-1 border-[#E9E9E9]",
          "data-[selected=true]:border-primary",
          "w-full"
        ),
        labelWrapper: "w-screen",
      }}
    >
      <div className="flex items-center space-x-3">
        {iconPath && (
          <div className="rounded-full bg-[#FFF0F1] w-10 h-10 p-1 flex items-center justify-center">
            <img src={iconPath} width={24} height={24} />
          </div>
        )}
        <div>
          {children}
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </Radio>
  );
};

// Strategy
export default function Step2() {
  const { data, setData, setCanNext, canNext } = useStepperStore();
  const strategySets = [
    {
      id: 1,
      name: "Basket Trade1",
      description: "Basket Trade1 description",
      value: "basketTrade1",
      iconPath: "/public/empty-bot.png",
    },
    {
      id: 2,
      name: "Basket Trade2",
      description: "Basket Trade2 description",
      value: "basketTrade2",
    },
    {
      id: 3,
      name: "Custom Strategy",
      description: "Custom Strategy description",
      value: "customStrategy",
    },
  ];
  useEffect(() => {
    if (data.strategy && data.strategy?.length > 0) {
      setCanNext(true);
    } else {
      setCanNext(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.strategy, canNext]);
  return (
    <div>
      <FormHeader
        title="Select Preset Strategy"
        description="Choose one of the templates or create a custom one with prompt."
      />
      <RadioGroup
      // description="Selected plan can be changed at any time."
      // label="Plans"
      >
        {strategySets.map((strategy) => (
          <CustomRadio
            description={strategy.description}
            key={strategy.id}
            value={strategy.value}
            onChange={(e) => {
              setData({ strategy: e.target.value });
            }}
            iconPath={strategy?.iconPath}
          >
            {strategy.name}
          </CustomRadio>
        ))}
      </RadioGroup>
      <Textarea
        // label="Custom Strategy"
        placeholder="Input your prompt strategy"
        value={data.strategy}
        className="mt-3"
        onChange={(e) => {
          setData({ strategy: e.target.value });
        }}
        minRows={8}
      />
    </div>
  );
}
