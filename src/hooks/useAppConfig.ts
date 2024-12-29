import { Schema } from "amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";

const client = generateClient<Schema>();

const useAppConfig = () => {
  const [config, setConfig] = useState<Schema["AppConfig"]["type"]>();

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.AppConfig.list();
    console.info("items", items);
    console.error(errors);
    setConfig(items[0]);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return config;
};

export default useAppConfig;
