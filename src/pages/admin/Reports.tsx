import React, { useEffect, useState } from 'react';
import { User as BaseUser } from '../../types/User';
import avatarDefault from '../../images/avatar_default.png';
import { useTranslation } from 'react-i18next';
import reportService from '../../services/reportService';
import { getTravelHistoryByIdAdmin } from '../../services/travelHistoryService';
import { getUserById } from '../../services/userService';
import API from '../../services/api';

import PaginationComponent from '../../components/admin/PaginationComponent';



interface User extends BaseUser {
    account?: {
        username: string;
        role: string;
        accountStatus: boolean;
    };
}

const Reports: React.FC = () => {
    
    const { t } = useTranslation();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTravelHistory, setSelectedTravelHistory] = useState<any | null>(null);
    const [travelHistoryLoading, setTravelHistoryLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userLoading, setUserLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const res = await reportService.getAllReports();
                setReports(res.data.data || []);
                setCurrentPage(1); // Reset về trang đầu khi load dữ liệu
            } catch (err) {
                setReports([]);
            }
            setLoading(false);
        };
        fetchReports();
    }, []);

    // Hàm lấy chi tiết travelHistory
    const handleShowTravelHistory = async (id: string) => {
        setTravelHistoryLoading(true);
        try {
            const res = await getTravelHistoryByIdAdmin(id);
            setSelectedTravelHistory(res.data.data);
        } catch (e) {
            setSelectedTravelHistory(null);
        }
        setTravelHistoryLoading(false);
    };

    // Hàm lấy chi tiết user
    const handleShowUser = async (user: any) => {
        setUserLoading(true);
        try {
            const userRes = await getUserById(user._id || user.id);
            const userData = userRes.data.data;
            // Lấy account
            const accountRes = await API.get(`/accounts/${user._id || user.id}`);
            userData.account = accountRes.data.data;
            setSelectedUser(userData);
        } catch (e) {
            setSelectedUser(null);
        }
        setUserLoading(false);
    };
    // Xóa report
    const handleDeleteReport = async (reportId: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa báo cáo này?')) return;
        try {
            await reportService.deleteReport(reportId);
            // Sau khi xóa, reload lại danh sách
            setReports(reports.filter(r => r._id !== reportId));
        } catch (e) {
            alert('Xóa báo cáo thất bại!');
        }
    };

    const normalizeGender = (gender?: string): 'male' | 'female' | 'other' => {
        const lower = typeof gender === 'string' ? gender.toLowerCase().trim() : '';

        if (['male', 'nam'].includes(lower)) return 'male';
        if (['female', 'nữ', 'nu'].includes(lower)) return 'female';
        return 'other';
    };

    // Pagination logic
    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;
    const currentReports = reports.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(reports.length / rowsPerPage);

    return (
        <div style={{ padding: 32 }}>
            <h2 style={{ color: '#2F80ED', fontWeight: 700, marginBottom: 24 }}>{t('report')}</h2>
            {loading ? (
                <div>{t('loading_data')}</div>
            ) : reports.length === 0 ? (
                <div style={{ color: '#888', fontStyle: 'italic' }}>{t('no_report', { defaultValue: 'Không có báo cáo nào.' })}</div>
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e0e7ef' }}>
                        <thead>
                            <tr style={{ background: '#f3f6ff', color: '#2F80ED', fontWeight: 600 }}>
                                <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('report_reason', { defaultValue: 'Lý do' })}</th>
                                <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('report_content', { defaultValue: 'Nội dung' })}</th>
                                <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('createdAt', { defaultValue: 'Thời gian' })}</th>
                                <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('reporter_name', { defaultValue: 'Người báo cáo' })}</th>
                                <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('reported_name', { defaultValue: 'Người bị báo cáo' })}</th>
                                <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('travelHistory.summary', { defaultValue: 'Chuyến đi' })}</th>
                                <th style={{ padding: 12, border: '1px solid #e0e7ef' }}>{t('Action', { defaultValue: 'Hành động' })}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReports.map((r: any) => {
                                let travelSummary = '';
                                if (r.travelHistoryId) {
                                    const dest = r.travelHistoryId.destination || '';
                                    const arrival = r.travelHistoryId.arrivalDate ? new Date(r.travelHistoryId.arrivalDate).toLocaleDateString() : '';
                                    const ret = r.travelHistoryId.returnDate ? new Date(r.travelHistoryId.returnDate).toLocaleDateString() : '';
                                    travelSummary = `${dest} ${arrival}${arrival && ret ? '-' : ''}${ret}`;
                                }
                                return (
                                    <tr key={r._id}>
                                        <td style={{ padding: 10, border: '1px solid #e0e7ef' }}>{r.titleReport}</td>
                                        <td style={{ padding: 10, border: '1px solid #e0e7ef' }}>{r.description}</td>
                                        <td style={{ padding: 10, border: '1px solid #e0e7ef' }}>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
                                        <td style={{ padding: 10, border: '1px solid #e0e7ef', color: '#2F80ED', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleShowUser(r.userId)}>{r.userId?.fullName || ''}</td>
                                        <td style={{ padding: 10, border: '1px solid #e0e7ef', color: '#2F80ED', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleShowUser(r.userIsReported)}>{r.userIsReported?.fullName || ''}</td>
                                        <td style={{ padding: 10, border: '1px solid #e0e7ef', color: '#2F80ED', cursor: travelSummary ? 'pointer' : 'default', textDecoration: travelSummary ? 'underline' : 'none' }} onClick={() => travelSummary && handleShowTravelHistory(r.travelHistoryId?._id)}>{travelSummary}</td>
                                        <td style={{ padding: 10, border: '1px solid #e0e7ef' }}>
                                            <button onClick={() => handleDeleteReport(r._id)} style={{ background: '#eb5757', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 600 }}>Xóa</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: number) => setCurrentPage(page)}
                    />
                </>
            )}

            {/* Modal chi tiết travelHistory */}
            {selectedTravelHistory && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedTravelHistory(null)}>
                    <div style={{ background: '#fff', padding: 32, borderRadius: 14, minWidth: 340, maxWidth: 700, boxShadow: '0 8px 32px rgba(44,62,80,0.18)', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedTravelHistory(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
                        <h3 style={{ fontWeight: 700, color: '#2F80ED', marginBottom: 18 }}>{t('travelHistory.detailTitle', { defaultValue: 'Chi tiết chuyến đi' })}</h3>
                        {travelHistoryLoading ? (
                            <div>{t('loading_data')}</div>
                        ) : (
                            <div>
                                <div style={{ marginBottom: 10 }}><b>{t('travelHistory.destination', { defaultValue: 'Địa điểm' })}:</b> {selectedTravelHistory.destination}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('travelHistory.arrivalDate', { defaultValue: 'Ngày đến' })}:</b> {selectedTravelHistory.arrivalDate ? new Date(selectedTravelHistory.arrivalDate).toLocaleDateString() : ''}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('travelHistory.returnDate', { defaultValue: 'Ngày về' })}:</b> {selectedTravelHistory.returnDate ? new Date(selectedTravelHistory.returnDate).toLocaleDateString() : ''}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('travelHistory.status', { defaultValue: 'Trạng thái' })}:</b> {selectedTravelHistory.status}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('travelHistory.creator', { defaultValue: 'Người tạo' })}:</b> {selectedTravelHistory.creatorId?.fullName || selectedTravelHistory.creatorId}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('travelHistory.participants', { defaultValue: 'Thành viên' })}:</b> {Array.isArray(selectedTravelHistory.participants) ? selectedTravelHistory.participants.map((p: any) => p.fullName || p).join(', ') : ''}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('travelHistory.notes', { defaultValue: 'Ghi chú' })}:</b> {selectedTravelHistory.notes?.map((note: any, idx: number) => <div key={idx}>{note.text}</div>)}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('travelHistory.expenses', { defaultValue: 'Chi tiêu' })}:</b> {selectedTravelHistory.expenses?.map((ex: any, idx: number) => <div key={idx}>{ex.name}: {ex.price}đ</div>)}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal chi tiết user */}
            {selectedUser && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedUser(null)}>
                    <div style={{ background: '#fff', padding: 32, borderRadius: 14, minWidth: 340, maxWidth: 500, boxShadow: '0 8px 32px rgba(44,62,80,0.18)', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
                        <h3 style={{ fontWeight: 700, color: '#2F80ED', marginBottom: 18 }}>{t('user.detailTitle', { defaultValue: 'Thông tin người dùng' })}</h3>
                        {userLoading ? (
                            <div>{t('loading_data')}</div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                                    <img
                                        src={typeof selectedUser.avatar === 'string' ? selectedUser.avatar : selectedUser.avatar?.url || avatarDefault}
                                        alt="Avatar"
                                        style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginRight: 16, background: '#eee', border: '1px solid #e0e7ef' }}
                                    />
                                    <span style={{ fontWeight: 600, fontSize: 18 }}>{selectedUser.fullName}</span>
                                </div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.username', { defaultValue: 'Tên đăng nhập' })}:</b> {selectedUser.account?.username}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.email', { defaultValue: 'Email' })}:</b> {selectedUser.email}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.role', { defaultValue: 'Vai trò' })}:</b> {selectedUser.account ? selectedUser.account.role : '-'}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.status', { defaultValue: 'Trạng thái' })}:</b> <span style={{ color: selectedUser.account ? (selectedUser.account.accountStatus ? '#219653' : '#eb5757') : '#888', fontWeight: 600 }}>{selectedUser.account ? (selectedUser.account.accountStatus ? t('user.active', { defaultValue: 'Hoạt động' }) : t('user.inactive', { defaultValue: 'Đã khóa' })) : '-'}</span></div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.fullName', { defaultValue: 'Họ tên' })}:</b> {selectedUser.fullName}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.dob', { defaultValue: 'Ngày sinh' })}:</b> {selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : ''}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.phone', { defaultValue: 'Số điện thoại' })}:</b> {selectedUser.phone}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.address', { defaultValue: 'Địa chỉ' })}:</b> {selectedUser.address}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.hometown', { defaultValue: 'Quê quán' })}:</b> {selectedUser.hometown}</div>
                                <div style={{ marginBottom: 10 }}>
                                    <b>{t('userManagement.gender')}:</b>{' '}
                                    {t(`userManagement.gender_${normalizeGender(selectedUser.gender)}`)}
                                </div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.cccd', { defaultValue: 'CCCD' })}:</b> {selectedUser.cccd}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.hobbies', { defaultValue: 'Sở thích' })}:</b> {selectedUser.hobbies?.join(', ')}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.description', { defaultValue: 'Mô tả' })}:</b> {selectedUser.description}</div>
                                <div style={{ marginBottom: 10 }}><b>{t('userManagement.job', { defaultValue: 'Nghề nghiệp' })}:</b> {selectedUser.job}</div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
