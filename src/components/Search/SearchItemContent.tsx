interface SearchItemContentProps {
  result: any;
}

export const SearchItemContent = (props: SearchItemContentProps) => {
  return (
    <>
      Blabla
      {JSON.stringify(props.result)}
    </>
  );
};
