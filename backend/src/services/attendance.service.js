import * as attendanceModel from '../models/attendance.model.js';

export async function registerAttendance(qrToken, teacherId) {
    try {
        const result = await attendanceModel.recordAttendance(qrToken, teacherId);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getTodayAttendanceList(teacherId = null) {
    try {
        const attendances = await attendanceModel.getTodayAttendance(teacherId);
        return attendances;
    } catch (error) {
        throw error.message;
    }
}

export async function addIncidentComment(attendanceId, comment) {
    try {
        const result = await attendanceModel.addIncident(attendanceId, comment);
        return result;
    } catch (error) {
        throw error;
    }
}
