import { Attribute, Drone, Policy } from "./admin/types";

export interface AccessRequest {
  drone_id: string;
  request_target: number;
}

export interface AccessResponse {
  granted: boolean;
  message: string;
}

export const fetchDronesByZone = async (zone: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/drones/zone/${zone}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchAttributesByName = async (name: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attributes/${name}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const sendAccessRequest = async (request: AccessRequest) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/access-request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const fetchDrones = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/drones`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchPolicies = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/policies`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchAttributes = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attributes`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const CreateAttribute = async (newAttribute: Attribute) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attributes`,
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attributes/${id}`,
    {
      method: "PUT",
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

export const DeleteAttribute = async (attributeId: string | null) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attributes/${attributeId}`,
    {
      method: "DELETE",
    }
  );
  if (!response) {
    throw new Error("Network response was not ok");
  }
};

export const CreateDrone = async (newDrone: Drone) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/drones`, {
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/drones/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDrone),
    }
  );
  if (!response) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const DeleteDrone = async (droneId: string | null) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/drones/${droneId}`,
    {
      method: "DELETE",
    }
  );
  if (!response) {
    throw new Error("Network response was not ok");
  }
};

export const CreatePolicy = async (newPolicy: Policy) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/policies`, {
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/policies/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPolicy),
    }
  );
  if (!response) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const DeletePolicy = async (policyId: string | null) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/policies/${policyId}`,
    {
      method: "DELETE",
    }
  );
  if (!response) {
    throw new Error("Network response was not ok");
  }
};
