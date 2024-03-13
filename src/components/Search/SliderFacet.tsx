import React from "react";
import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";

export const SliderFacet = () => {
  const [value, setValue] = React.useState([500, 2000]);

  return (
    <Slider
      defaultValue={value}
      value={value}
      onChange={setValue}
      className="w-[450px]"
      maxValue={3000}
    >
      <div className="flex">
        <Label className="flex-1 font-bold">Min/max number of words</Label>
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
