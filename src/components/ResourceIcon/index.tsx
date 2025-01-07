import classNames from "classnames";

type Props = {
  resource: ResourceNames;
  size?: "small" | "medium" | "large";
};

function ResourceIcon({ resource, size = "medium" }: Props) {
  const getPath = () => {
    switch (resource) {
      case "wood":
        return "./log.png";
      case "stone":
        return "./stone.png";
      case "food":
        return "./food.png";
      case "gold":
        return "./money.png";
      default:
        return "";
    }
  };
  return (
    <img
      src={getPath()}
      alt={resource}
      className={classNames(
        size == "small" && "w-5 h-5",
        size == "medium" && "w-7 h-7"
      )}
    />
  );
}

export default ResourceIcon;
