import React from "react";
import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";

type SliderFacetProps = {
  defaultValue: number | number[];
  maxValue: number;
  onChange: (newValue: number | number[]) => void;
};

/**
 * {@link SliderFacetProps.defaultValue} is used to differentiate
 * between single and multi thumb sliders.
 * For single thumb slider, use "number"; for multi thumb sliders, use "number[]".
 */
export const SliderFacet = (props: SliderFacetProps) => {
  const translateProject = useProjectStore(translateProjectSelector);
  const [value, setValue] = React.useState<number | number[]>(
    props.defaultValue,
  );

  const sliderOnChangeHandler = (newValue: number | number[]) => {
    setValue(newValue);
    props.onChange(newValue);
  };

  return (
    <Slider
      defaultValue={props.defaultValue}
      value={value}
      onChange={(newValue) => sliderOnChangeHandler(newValue)}
      className="w-[450px]"
      maxValue={props.maxValue}
    >
      <div className="flex">
        <Label className="flex-1 font-bold">
          {translateProject("sliderFacetLabel")}
        </Label>
        <SliderOutput>
          {({ state }) =>
            state.values.map((_, i) => state.getThumbValueLabel(i)).join(" – ")
          }
        </SliderOutput>
      </div>
      <SliderTrack className="relative h-7 w-full">
        {({ state }) => (
          <>
            {/* track */}
            <div className="bg-brand2-500/40 absolute top-[50%] h-2 w-full translate-y-[-50%] rounded-full" />
            {/* fill */}
            <div
              className="bg-brand2-500/40 absolute top-[50%] h-2 translate-y-[-50%] rounded-full"
              style={{ width: state.getThumbPercent(0) * 100 + "%" }}
            />
            {state.values.map((_, i) => (
              <SliderThumb
                key={i}
                index={i}
                className="dragging:bg-brand2-300 border-brand2-800/75 bg-brand2-700 top-[50%] h-7 w-7 rounded-full border border-solid outline-none ring-black transition focus-visible:ring-2"
              />
            ))}
          </>
        )}
      </SliderTrack>
    </Slider>
  );
};
