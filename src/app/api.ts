import { Attribute, Drone, Policy } from "./admin/types";

export interface AccessRequest {
  entity_id: string;
  request_target: number;
}

export interface AccessResponse {
  granted: boolean;
  message: string;
}

export const fetchDronesByZone = async (zone: number) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/getDronesByZone/${zone}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchAttributesByName = async (name: string) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/getAttributeByName/${name}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const sendAccessRequest = async (request: AccessRequest) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "1") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/layer-1";
  } else if (layer === "2") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/layer-2";
  } else if (layer === "3") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/layer-3";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/layer-4";
  }
  const response = await fetch(`${endpoint}/accessRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const fetchDrones = async () => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/getDrones`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchPolicies = async () => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4" || layer === "3") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/getPolicies`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchAttributes = async () => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/getAttributes`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const CreateAttribute = async (newAttribute: Attribute) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/createAttribute`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAttribute),
    }
  );

  if (!response) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const UpdateAttribute = async (newAttribute: Attribute, id: string) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/updateAttribute/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAttribute),
  });
  if (!response) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const DeleteAttribute = async (attributeId: string | null) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/removeAttribute/${attributeId}`,
    {
      method: "DELETE",
    }
  );
  if (!response) {
    throw new Error("Network response was not ok");
  }
};

export const CreateDrone = async (newDrone: Drone) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/createDrone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDrone),
  });

  if (!response) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const UpdateDrone = async (newDrone: Drone, id: string) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/updateDrone/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDrone),
  });
  if (!response) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const DeleteDrone = async (droneId: string | null) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/removeDrone/${droneId}`, {
    method: "DELETE",
  });
  if (!response) {
    throw new Error("Network response was not ok");
  }
};

export const CreatePolicy = async (newPolicy: Policy) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4" || layer == "3") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/createPolicy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPolicy),
  });

  if (!response) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const UpdatePolicy = async (newPolicy: Policy, id: string) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4" || layer == "3") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/updatePolicy/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPolicy),
  });
  if (!response) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const DeletePolicy = async (policyId: string | null) => {
  const layer = localStorage.getItem("layer");
  var endpoint;
  if (layer === "4" || layer == "3") {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/on-chain";
  } else {
    endpoint = process.env.NEXT_PUBLIC_API_URL + "/off-chain";
  }
  const response = await fetch(`${endpoint}/removePolicy/${policyId}`, {
    method: "DELETE",
  });
  if (!response) {
    throw new Error("Network response was not ok");
  }
};
