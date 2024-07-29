export interface AccessRequest {
  drone_id: string;
  request_target: string;
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
