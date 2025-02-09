import useStepperStore from "@/stores/createAgent.store";
import { RadioGroup, Radio, cn, RadioProps, Textarea } from "@heroui/react";
import { useEffect } from "react";

interface CustomRadioProps extends RadioProps {
  children: React.ReactNode;
}

export const CustomRadio = (props: CustomRadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
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
          >
            {strategy.name}
          </CustomRadio>
        ))}
      </RadioGroup>
      <Textarea
        label="Custom Strategy"
        placeholder="Enter your custom strategy"
        value={data.strategy}
        onChange={(e) => {
          setData({ strategy: e.target.value });
        }}
      />
    </div>
  );
}
