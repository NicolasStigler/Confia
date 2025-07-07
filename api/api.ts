import axios, { AxiosResponse } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

const BACKEND_URL = 'http://192.168.1.77:8080';

// Types for Auth
export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  firstname: string;
  lastname: string;
  age: number;
  email: string;
  password: string;
  isWorker: string;
  district?: { name: string };
  direccion?: string;
}
export interface JwtPayload {
  role: string;
  exp: number;
  iat: number;
  [key: string]: any;
}
export interface AuthResponse {
  token: string;
}

// Generic error type
type ApiError = any;

// Utility
export const getRoleBasedOnToken = async ():  Promise<string | undefined> => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) return undefined;
    const decodedToken = jwtDecode<JwtPayload>(token);
    return decodedToken.role;
}

export const fetchLogin = async (body: LoginRequest): Promise<string | undefined> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(`${BACKEND_URL}/auth/login`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      await SecureStore.setItemAsync('token', response.data.token);
      return getRoleBasedOnToken();
    }
  } catch (error) {
    console.error('Login axios failed: ', error);
    throw error;
  }
};

export const fetchRegister = async (body: RegisterRequest): Promise<string | undefined> => {
  console.log('Ver body: ', body);
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(`${BACKEND_URL}/auth/register`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 201 || response.status === 200) {
      await SecureStore.setItemAsync('token', response.data.token);
      return getRoleBasedOnToken();
    }
  } catch (error) {
    console.error('Register axios failed: ', error, body);
    throw error;
  }
};

export const fetchPostService = async (body) => {
    const token = await SecureStore.getItemAsync('token');
    try {
        const response = await axios.post(`${BACKEND_URL}/servicio`, body, {
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json',
            },
        });
        if (response.status===201){
            return response.status;
        }
    } catch (error) {
        console.error('fetchPostService failed: ',error);
        throw error;
    }
}

export const fetchGetWorkerMe=async()=>{
    const token=await SecureStore.getItemAsync('token');
    try{
        const response=await axios.get(`${BACKEND_URL}/worker/me`,{
            headers:{
                'Authorization':`Bearer ${token}`,
            },
        });
        if(response.status===200){
            return response.data;
        }
    }catch(error){
        console.error('fetchGetWorkerMe axios failed: ',error);
        throw error;
    }
}

export const fetchUpdateWorkerProfile=async (body)=>{
    const token=await SecureStore.getItemAsync('token');
    try{
        const response=await axios.patch(`${BACKEND_URL}/worker/me`,body,{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,
            },
        });
        if (response.status===200){
            return response.data;
        }
    }catch(error){
        console.error('fetchUpdateWorkerProfile failed: ',error);
        throw error;
    }
}
/*export const fetchUpdateWorkerImage=async()=>{
    const token= await SecureStore.getItemAsync('token');
    try{
        const response=await axios.post
    }catch(error){
        console.error('fetchUpdateWorkerImage failed: ',error);
        throw error;
    }
}*/

export const fetchUpdateWorkerImage = async (imageUri) => {
    const token = await SecureStore.getItemAsync('token');
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'profile.jpg', // Puedes cambiar el nombre y extensión según sea necesario
      type: 'image/jpeg', // Puedes ajustar el tipo según el formato de la imagen
    });
  
    try {
      const response = await axios.patch(`${BACKEND_URL}/worker/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('fetchUpdateWorkerImage failed: ', error);
      throw error;
    }
};

export const fetchSetWorkerSchedule=async(body)=>{
    console.log(body);
    const token=await SecureStore.getItemAsync('token');
    try{
        const response=await axios.post(`${BACKEND_URL}/schedule/worker/me`,body,{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,

            },
        });
        return response.status;
    }catch(error){
        console.error('fetchSetWorkerSchedule failed: ',error);
        throw error;
    }
}

export const fetchGetWorkerSchedulesByDate = async (fecha) => {
    const token = await SecureStore.getItemAsync('token');
    console.log(fecha);
    try {
        const response = await axios.get(`${BACKEND_URL}/schedule/worker/me/date`, {
            params: { date: fecha }, // Enviar la fecha como parámetro de consulta
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        console.log(response.data);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error){
        console.error('fetchGetWorkerSchedulesByDate failed: ', error);
        throw error;
    }
};

export const fetchGetWorkerServices=async()=>{
    const token = await SecureStore.getItemAsync('token');
    try{
        const response=await axios.get(`${BACKEND_URL}/servicio/worker`,{
            headers:{
                'Authorization': `Bearer ${token}`,
            },
        });
        if(response.status===200){
            return response.data;
        }
    }catch(error){
        console.error('fetchGetWorkerServices failed: ',error);
        throw error;
    }
}

export const fetchGetServicios=async()=>{
    const token = await SecureStore.getItemAsync('token');
    try{
        const response=await axios.get(`${BACKEND_URL}/servicio`,{
            headers:{
                'Authorization': `Bearer ${token}`,
            },
        });
        if(response.status===200){
            return response.data;
        }
    }catch(error){
        console.error('fetchGetWorkerServices failed: ',error);
        throw error;
    }
}


export const fetchGetServiciosByName = async (name, page, size) => {
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await axios.get(`${BACKEND_URL}/servicio/search`, {
        params: { name, page, size },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('fetchGetServiciosByName failed: ', error);
      throw error;
    }
};

export const fetchGetWorkerSchedulesBySevenDays = async (workerId, fechaInicio, fechaFin) => {
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await axios.get(`${BACKEND_URL}/worker/${workerId}/schedules/dates`, {
        params: {
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('fetchGetWorkerSchedulesBySevenDays failed: ', error);
      throw error;
    }
};

export const fetchGetWorkerServiceFinalPage = async (workerId, serviceName) => {
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await axios.get(`${BACKEND_URL}/servicio/worker/${workerId}/name`, {
        params: {
          serviceName: serviceName,
        },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('fetchGetWorkerServiceFinalPage failed: ', error);
      throw error;
    }
};

export const fetchCreateAppointment=async(body)=>{
    console.log(body);
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await axios.post(`${BACKEND_URL}/appointment`, body,{
        headers: {
            'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        return response.status;
      }
    } catch (error) {
      console.error('fetchCreateAppointment failed: ', error);
      throw error;
    }
}

export const fetchGetWorkerAppointmentsByStatus = async (status, date) => {
    console.log(status,date);
    const token = await SecureStore.getItemAsync('token');
    try {
        const response = await axios.get(`${BACKEND_URL}/appointment/worker/status`, {
            params: { status, date },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('fetchGetWorkerAppointmentsByStatus failed: ', error);
        throw error;
    }
};

export const fetchWorkerUpdateCitaStatus = async (appointmentId, status) => {
    const token = await SecureStore.getItemAsync('token');
    console.log(appointmentId, status);
    try {
        const response = await axios.patch(`${BACKEND_URL}/appointment/${appointmentId}/status`, null, {
            params: { status },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('fetchWorkerUpdateCitaStatus failed: ', error);
        throw error;
    }
};

export const fetchGetClientMe=async()=>{
    const token = await SecureStore.getItemAsync('token');
    try {
        const response = await axios.get(`${BACKEND_URL}/client/me`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('fetchGetClientMe failed: ', error);
        throw error;
    }
}

export const fetchUpdateClientProfile=async(body)=>{
    console.log(body);
    const token=await SecureStore.getItemAsync('token');
    try{
        const response=await axios.put(`${BACKEND_URL}/client/me`,body,{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,
            },
        });
        if (response.status===200){
            return response.status;
        }
    }catch(error){
        console.error('fetchUpdateClientProfile failed: ',error);
        throw error;
    }
}

export const fetchUpdateClientImage=async(imageUri)=>{
    const token = await SecureStore.getItemAsync('token');
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'profile.jpg', // Puedes cambiar el nombre y extensión según sea necesario
      type: 'image/jpeg', // Puedes ajustar el tipo según el formato de la imagen
    });
  
    try {
      const response = await axios.patch(`${BACKEND_URL}/client/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('fetchUpdateClientImage failed: ', error);
      throw error;
    }
}

export const fetchGetClientAppointmentsByStatus = async (status, date) => {
    console.log(status,date);
    const token = await SecureStore.getItemAsync('token');
    try {
        const response = await axios.get(`${BACKEND_URL}/appointment/client/status`, {
            params: { status, date },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('fetchGetClientAppointmentsByStatus failed: ', error);
        throw error;
    }
};

export const fetchCreateReview=async(body)=>{
    const token = await SecureStore.getItemAsync('token');
    try{
        const response=await axios.post(`${BACKEND_URL}/review`,body,{
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        if(response.status===201){
            return response.status;
        }
    }catch(error){
        console.error('fetchCreateReview failed: ',error);
        throw error;
    }

}

export const fetchGetClientAppointmentsNotReviewed=async()=>{
    const token = await SecureStore.getItemAsync('token');
    try{
        const response=await axios.get(`${BACKEND_URL}/appointment/client/notreviewed`,{
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        if(response.status===200){
            return response.data;
        }
    }catch(error){
        console.error('fetchGetClientAppointmentsNotReviewed failed: ',error);
        throw error;
    }
}
































/*export const fetchGetClientMe=async()=>{
    const token=await SecureStore.getItemAsync('token');
    try{
        if (dummyData){
            return {
                id: 1,
                firstname: 'Juan',
                lastname: 'Perez',
                age: 25,
                role: 'ROLE_CLIENT',
            };
        } else {
            const response=await axios.get(`${BACKEND_URL}/client/me`,{
                headers:{
                    'Authorization':`Bearer ${token}`,
                },
            });
            if(response.status===200){
                return response.data;
            }
        }
    }catch(error){
        console.error('fetchGetClientMe axios failed: ',error);
        throw error;
    }
}*/

/*export const fetchGetServices=async()=>{
    const token=await SecureStore.getItemAsync('token');
    try{
        if (dummyData){
            return [
                {
                    id: 1,
                    name: 'Pintura de casa',
                    price: 100,
                    status: 'DISPONIBLE',
                },
                {
                    id: 2,
                    name: 'Corte de cabello',
                    price: 10,
                    status: 'DISPONIBLE',
                },
                {
                    id: 3,
                    name: 'Reparación de computadoras',
                    price: 50,
                    status: 'DISPONIBLE',
                },
            ];
        } else {
            const response=await axios.get(`${BACKEND_URL}/servicio`,{
                headers:{
                    'Authorization':`Bearer ${token}`,
                },
            });
            if(response.status===200){
                return response.data;
            }
        }
    }catch(error){
        console.error('fetchGetServices axios failed: ',error);
        throw error;
    }
}

export const fetchGetServiceById=async(id)=>{
    const token=await SecureStore.getItemAsync('token');
    try{
        if (dummyData){
            return {
                id: 1,
                name: 'Pintura de casa',
                description: 'Pintura de casa de 2 pisos con 3 habitaciones',
                price: 100,
                status: 'DISPONIBLE',
                distritos_atiende: [
                    {
                        id: 1,
                        name: 'San Miguel',
                    },
                    {
                        id: 2,
                        name: 'Magdalena',
                    },
                ],
            };
        } else {
            const response=await axios.get(`${BACKEND_URL}/servicio/${id}`,{
                headers:{
                    'Authorization':`Bearer ${token}`,
                },
            });
            if(response.status===200){
                return response.data;
            }
        }
    }
    catch(error){
        console.error('fetchGetServiceById axios failed: ',error);
        throw error;
    }
}

export const fetchRequestService=async(id)=>{
    const token=await SecureStore.getItemAsync('token');
    try{
        if (dummyData){
            return 200;
        } else {
            const response=await axios.post(`${BACKEND_URL}/servicio/${id}/solicitar`,null,{
                headers:{
                    'Authorization':`Bearer ${token}`,
                },
            });
            return response.status;
        }
    }
    catch(error){
        console.error('fetchRequestService axios failed: ',error);
        throw error;
    }
}*/

/*export const fetchGetWorkerServices=async()=>{
    const token=await SecureStore.getItemAsync('token');
    try{
        if (dummyData){
            return [
                {
                    id: 1,
                    name: 'Pintura de casa',
                    description: 'Pintura de casa de 2 pisos con 3 habitaciones',
                    price: 100,
                    status: 'DISPONIBLE',
                    distritos_atiende: [
                        {
                            id: 1,
                            name: 'San Miguel',
                        },
                        {
                            id: 2,
                            name: 'Magdalena',
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'Corte de cabello',
                    description: 'Corte de cabello de hombre',
                    price: 10,
                    status: 'DISPONIBLE',
                    distritos_atiende: [
                        {
                            id: 1,
                            name: 'San Miguel',
                        },
                        {
                            id: 2,
                            name: 'Magdalena',
                        },
                    ],
                },
                {
                    id: 3,
                    name: 'Reparación de computadoras',
                    description: 'Reparación de computadoras de escritorio',
                    price: 50,
                    status: 'DISPONIBLE',
                    distritos_atiende: [
                        {
                            id: 1,
                            name: 'San Miguel',
                        },
                        {
                            id: 2,
                            name: 'Magdalena',
                        },
                    ],
                },
            ];
        } else {
            const response=await axios.get(`${BACKEND_URL}/worker/servicio`,{
                headers:{
                    'Authorization':`Bearer ${token}`,
                },
            });
            if(response.status===200){
                return response.data;
            }
        }
    }
    catch(error){
        console.error('fetchGetWorkerServices axios failed: ',error);
        throw error;
    }
}*/

/*export const fetchUpdateService=async(id,body)=>{
    const token=await SecureStore.getItemAsync('token');
    try{
        if (dummyData){
            return 200;
        } else {
            const response=await axios.put(`${BACKEND_URL}/servicio/${id}`,body,{
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json',
                },
            });
            return response.status;
        }
    }
    catch(error){
        console.error('fetchUpdateService axios failed: ',error);
        throw error;
    }
}

export const fetchDeleteService=async(id)=>{
    const token=await SecureStore.getItemAsync('token');
    try{
        if (dummyData){
            return 204;
        } else {
            const response=await axios.delete(`${BACKEND_URL}/servicio/${id}`,{
                headers:{
                    'Authorization':`Bearer ${token}`,
                },
            });
            return response.status;
        }
    }
    catch(error){
        console.error('fetchDeleteService axios failed: ',error);
        throw error;
    }
}*/
