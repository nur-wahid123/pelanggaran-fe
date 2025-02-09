import CONFIG from "./config"

const ENDPOINT = {

    //Violation Type
    CREATE_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/create`,
    DETAIL_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/detail`,
    UPDATE_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/update`,
    DELETE_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/delete`,
    MASTER_VIOLATION_TYPE: `${CONFIG.BASE_URL}/violation-type/list`,

    //Class
    CREATE_CLASS: `${CONFIG.BASE_URL}/class/create`,
    DETAIL_CLASS: `${CONFIG.BASE_URL}/class/detail`,
    UPDATE_CLASS: `${CONFIG.BASE_URL}/class/update`,
    DELETE_CLASS: `${CONFIG.BASE_URL}/class/delete`,
    MASTER_CLASS: `${CONFIG.BASE_URL}/class/list`,

    //Authentication
    LOGIN: `${CONFIG.BASE_URL}/auth/login`,
    GET_PROFILE: `${CONFIG.BASE_URL}/auth/profile`,
    LOGOUT: `${CONFIG.BASE_URL}/auth/logout`,

    //Users
    CREATE_USER: `${CONFIG.BASE_URL}/users/create`,
    DETAIL_USER: `${CONFIG.BASE_URL}/users/detail`,
    UPDATE_USER: `${CONFIG.BASE_URL}/users/update`,
    SELF_UPDATE_USER: `${CONFIG.BASE_URL}/users/self-update`,
    DELETE_USER: `${CONFIG.BASE_URL}/users/remove`,
    MASTER_USER: `${CONFIG.BASE_URL}/users/list`,

    //School Profile
    UPDATE_SCHOOL_PROFILE: `${CONFIG.BASE_URL}/school-profile/update`,
    SCHOOL_PROFILE: `${CONFIG.BASE_URL}/school-profile/data`,

} as const

export default ENDPOINT