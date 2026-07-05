import { useMemo } from "react";
import "./DashboardPage.css";
import {
    FiActivity,
    FiBarChart2,
    FiClock,
    FiDatabase,
    FiEdit3,
    FiRefreshCw,
    FiTrendingUp,
    FiUsers,
} from "react-icons/fi";
import { useAdmin } from "../../../context/AdminContext";

const FALLBACK_USAGE = [
    { id: 1, name: "Quick Sort", count: 48, color: "#7c5cff" },
    { id: 2, name: "Selection Sort", count: 30, color: "#20c997" },
    { id: 3, name: "Interchange Sort", count: 22, color: "#ffb020" },
];

const FALLBACK_LINE = [18, 26, 22, 34, 40, 36, 52];
const COLORS = ["#7c5cff", "#20c997", "#ffb020", "#38bdf8", "#f87171"];

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);

function getDateKey(dateValue) {
    const date = dateValue ? new Date(dateValue) : new Date();
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

function buildLinePoints(values) {
    const width = 640;
    const height = 220;
    const padding = 22;
    const max = Math.max(...values, 1);
    const stepX = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;

    return values
        .map((value, index) => {
            const x = padding + index * stepX;
            const y = height - padding - (value / max) * (height - padding * 2);
            return `${x},${y}`;
        })
        .join(" ");
}

function LineChart({ values }) {
    const points = buildLinePoints(values);
    const max = Math.max(...values, 1);

    return (
        <div className="line-chart" aria-label="Biểu đồ lượt sử dụng theo ngày">
            <svg viewBox="0 0 640 220" role="img">
                <defs>
                    <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polyline className="chart-grid-line" points="22,54 618,54" />
                <polyline className="chart-grid-line" points="22,110 618,110" />
                <polyline className="chart-grid-line" points="22,166 618,166" />
                <polygon points={`22,198 ${points} 618,198`} fill="url(#lineFill)" />
                <polyline className="chart-line" points={points} />
                {points.split(" ").map((point, index) => {
                    const [cx, cy] = point.split(",");
                    return <circle key={index} className="chart-dot" cx={cx} cy={cy} r="5" />;
                })}
            </svg>
            <div className="chart-scale">
                <span>7 ngày gần đây</span>
                <span>Cao nhất {formatNumber(max)} lượt</span>
            </div>
        </div>
    );
}

function DonutChart({ data }) {
    const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
    let offset = 25;

    return (
        <div className="donut-wrap">
            <svg className="donut-chart" viewBox="0 0 42 42" role="img" aria-label="Biểu đồ thuật toán dùng nhiều">
                <circle className="donut-ring" cx="21" cy="21" r="15.915" />
                {data.map((item) => {
                    const percent = (item.count / total) * 100;
                    const dash = `${percent} ${100 - percent}`;
                    const segment = (
                        <circle
                            key={item.id}
                            className="donut-segment"
                            cx="21"
                            cy="21"
                            r="15.915"
                            stroke={item.color}
                            strokeDasharray={dash}
                            strokeDashoffset={offset}
                        />
                    );
                    offset -= percent;
                    return segment;
                })}
                <text x="21" y="20.2" className="donut-total">
                    {formatNumber(total)}
                </text>
                <text x="21" y="25" className="donut-label">
                    lượt
                </text>
            </svg>
        </div>
    );
}

export default function DashboardPage() {
    const {
        users = [],
        algorithms = [],
        simulations = [],
        pagination = {},
        algorithmPagination = {},
        loading,
        fetchUsers,
        fetchAlgorithms,
        fetchSimulations,
    } = useAdmin();

    const dashboardData = useMemo(() => {
        const totalUsers = pagination?.total || users.length;
        const activeUsers = pagination?.totalActive || users.filter((user) => user.status === 1).length;
        const totalAlgorithms = algorithmPagination?.total || algorithms.length;
        const activeAlgorithms = algorithms.filter((algorithm) => algorithm.status === 1).length || totalAlgorithms;
        const totalSimulations = simulations.length;

        const algorithmMap = new Map(
            algorithms.map((algorithm) => [
                algorithm.id,
                algorithm.name || algorithm.slug || `Thuật toán #${algorithm.id}`,
            ])
        );

        const usageMap = simulations.reduce((map, simulation) => {
            const id = simulation.algorithm_id || "unknown";
            const current = map.get(id) || {
                id,
                name: algorithmMap.get(id) || `Thuật toán #${id}`,
                count: 0,
            };
            current.count += 1;
            map.set(id, current);
            return map;
        }, new Map());

        const usageData = Array.from(usageMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((item, index) => ({ ...item, color: COLORS[index % COLORS.length] }));

        const chartUsage = usageData.length ? usageData : FALLBACK_USAGE;
        const mostUsed = chartUsage[0];

        const dailyMap = simulations.reduce((map, simulation) => {
            const key = getDateKey(simulation.executed_at);
            if (!key) return map;
            map.set(key, (map.get(key) || 0) + 1);
            return map;
        }, new Map());

        const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            return getDateKey(date);
        });

        const lineValues = lastSevenDays.map((key) => dailyMap.get(key) || 0);
        const hasLineData = lineValues.some((value) => value > 0);

        const recentSimulations = [...simulations]
            .sort((a, b) => new Date(b.executed_at || 0) - new Date(a.executed_at || 0))
            .slice(0, 4);

        return {
            totalUsers,
            activeUsers,
            totalAlgorithms,
            activeAlgorithms,
            totalSimulations,
            chartUsage,
            mostUsed,
            lineValues: hasLineData ? lineValues : FALLBACK_LINE,
            recentSimulations,
            algorithmMap,
        };
    }, [users, algorithms, simulations, pagination, algorithmPagination]);

    const handleRefresh = () => {
        fetchUsers?.(pagination?.page || 1);
        fetchAlgorithms?.(algorithmPagination?.page || 1);
        fetchSimulations?.();
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-eyebrow">Admin dashboard</span>
                    <h1>Tổng quan hệ thống</h1>
                </div>
                <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
                    <FiRefreshCw />
                    {loading ? "Đang tải" : "Làm mới"}
                </button>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <FiUsers size={26} />
                    <span>Tổng người dùng</span>
                    <h2>{formatNumber(dashboardData.totalUsers)}</h2>
                    <small>{formatNumber(dashboardData.activeUsers)} tài khoản hoạt động</small>
                </div>

                <div className="stat-card">
                    <FiDatabase size={26} />
                    <span>Thuật toán</span>
                    <h2>{formatNumber(dashboardData.totalAlgorithms)}</h2>
                    <small>{formatNumber(dashboardData.activeAlgorithms)} đang hiển thị</small>
                </div>

                <div className="stat-card">
                    <FiActivity size={26} />
                    <span>Lượt sử dụng</span>
                    <h2>{formatNumber(dashboardData.totalSimulations)}</h2>
                    <small>Lịch sử mô phỏng đã ghi nhận</small>
                </div>

                <div className="stat-card highlight">
                    <FiTrendingUp size={26} />
                    <span>Dùng nhiều nhất</span>
                    <h2>{dashboardData.mostUsed?.name || "Chưa có"}</h2>
                    <small>{formatNumber(dashboardData.mostUsed?.count)} lượt chạy</small>
                </div>
            </div>

            <div className="dashboard-grid chart-grid">
                <section className="dashboard-card usage-card">
                    <div className="card-title-row">
                        <div>
                            <span className="card-kicker">Thuật toán nổi bật</span>
                            <h3>Tỷ lệ sử dụng</h3>
                        </div>
                        <FiBarChart2 />
                    </div>

                    <div className="usage-layout">
                        <DonutChart data={dashboardData.chartUsage} />
                        <div className="legend-list">
                            {dashboardData.chartUsage.map((item) => (
                                <div className="legend-item" key={item.id}>
                                    <span className="legend-color" style={{ background: item.color }} />
                                    <span>{item.name}</span>
                                    <strong>{formatNumber(item.count)}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="dashboard-card trend-card">
                    <div className="card-title-row">
                        <div>
                            <span className="card-kicker">Lượt đăng nhập và dùng</span>
                            <h3>Xu hướng sử dụng</h3>
                        </div>
                        <FiActivity />
                    </div>
                    <LineChart values={dashboardData.lineValues} />
                </section>
            </div>

            <div className="dashboard-grid">
                <section className="dashboard-card">
                    <div className="card-title-row">
                        <div>
                            <span className="card-kicker">Gần đây</span>
                            <h3>Hoạt động người dùng</h3>
                        </div>
                        <FiClock />
                    </div>

                    <div className="activity-list">
                        {dashboardData.recentSimulations.length > 0 ? (
                            dashboardData.recentSimulations.map((simulation) => (
                                <div className="activity-item" key={simulation.id}>
                                    <span className="activity-dot user" />
                                    <div>
                                        <p>
                                            User #{simulation.user_id} chạy{" "}
                                            <b>{dashboardData.algorithmMap.get(simulation.algorithm_id) || `thuật toán #${simulation.algorithm_id}`}</b>
                                        </p>
                                        <small>
                                            {simulation.executed_at
                                                ? new Date(simulation.executed_at).toLocaleString("vi-VN")
                                                : "Vừa xong"}{" "}
                                            - {formatNumber(simulation.steps)} bước
                                        </small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="activity-item">
                                <span className="activity-dot user" />
                                <div>
                                    <p>Chưa có lịch sử mô phỏng từ API.</p>
                                    <small>Dashboard sẽ tự cập nhật khi người dùng chạy thuật toán.</small>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="dashboard-card">
                    <div className="card-title-row">
                        <div>
                            <span className="card-kicker">Quản trị</span>
                            <h3>Thao tác admin</h3>
                        </div>
                        <FiEdit3 />
                    </div>

                    <div className="admin-actions">
                        <div className="admin-action">
                            <span className="activity-dot admin" />
                            <div>
                                <p>Thêm thuật toán mới</p>
                                <strong>+{formatNumber(algorithms.length)}</strong>
                            </div>
                        </div>
                        <div className="admin-action">
                            <span className="activity-dot edit" />
                            <div>
                                <p>Cập nhật / chỉnh sửa thuật toán</p>
                                <strong>{formatNumber(dashboardData.activeAlgorithms)}</strong>
                            </div>
                        </div>
                        <div className="admin-action">
                            <span className="activity-dot lock" />
                            <div>
                                <p>Tài khoản bị khóa hoặc ngừng hoạt động</p>
                                <strong>{formatNumber(Math.max(dashboardData.totalUsers - dashboardData.activeUsers, 0))}</strong>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
