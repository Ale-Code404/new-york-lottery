const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat(undefined, { style: "percent" }).format(value);
};

export { formatNumber, formatPercent };
