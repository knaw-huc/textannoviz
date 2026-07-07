import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { Button, Tooltip, TooltipTrigger } from "react-aria-components";
import { useTranslateProject } from "../../stores/project";

type ScrollToTopButtonProps = {
  visible: boolean;
  onPress: () => void;
};

/**
 * Floating "scroll to top" button, positioned absolutely in the bottom-right
 * of its (relatively positioned) parent. When rendered, the parent should
 * reserve a right-hand lane so scrolling text does not slide under it.
 */
export const ScrollToTopButton = ({
  visible,
  onPress,
}: ScrollToTopButtonProps) => {
  const translateProject = useTranslateProject();

  if (!visible) return null;

  return (
    <TooltipTrigger delay={0} closeDelay={0}>
      <Button
        onPress={onPress}
        aria-label={translateProject("SCROLL_TO_TOP")}
        className="absolute bottom-2 right-1 rounded-full border bg-white p-2 text-neutral-600 shadow-md hover:text-neutral-800 active:text-black xl:right-5"
      >
        <ChevronUpIcon className="h-6 w-6" />
      </Button>
      <Tooltip
        offset={8}
        className="rounded bg-neutral-800 px-2 py-1 text-sm text-white shadow-md"
      >
        {translateProject("SCROLL_TO_TOP")}
      </Tooltip>
    </TooltipTrigger>
  );
};
