import apiClient from './apiClient';

export const ADDRESS_ENDPOINT = '/user/addresses';

export type Address = {
  _id: string;
  unitId?: string;
  user?: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AddressPayload = Omit<
  Address,
  '_id' | 'unitId' | 'user' | 'createdAt' | 'updatedAt'
>;

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  requestId?: string;
};

export async function getAddresses() {
  const {data} = await apiClient.get<ApiResponse<Address[]>>(ADDRESS_ENDPOINT);
  return data;
}

export async function createAddress(payload: AddressPayload) {
  const {data} = await apiClient.post<ApiResponse<Address>>(
    ADDRESS_ENDPOINT,
    payload,
  );
  return data;
}

export async function updateAddress(
  id: string,
  payload: Partial<AddressPayload>,
) {
  const {data} = await apiClient.patch<ApiResponse<Address>>(
    `${ADDRESS_ENDPOINT}/${encodeURIComponent(id)}`,
    payload,
  );
  return data;
}

export async function deleteAddress(id: string) {
  const {data} = await apiClient.delete<ApiResponse<null>>(
    `${ADDRESS_ENDPOINT}/${encodeURIComponent(id)}`,
  );
  return data;
}
