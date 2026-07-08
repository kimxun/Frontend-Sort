import { useMemo, useState } from "react";
import { FiActivity, FiClock, FiRefreshCw, FiTrash2, FiZap } from "react-icons/fi";
import { useAdmin } from "../../../context/AdminContext";
import "./SimulationHistoryPage.css";

const PAGE_SIZE = 10;

const formatNumber = (value) => Number(value || 0).toLocaleString("vi-VN");

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("vi-VN");
};

const formatData = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) return `[${parsed.join(", ")}]`;
    if (parsed && typeof parsed === "object") return JSON.stringify(parsed);
    return String(parsed);
  } catch {
    return String(value);
  }
};

const formatResult = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    if (
      parsed
      && !Array.isArray(parsed)
      && typeof parsed === "object"
      && Object.prototype.hasOwnProperty.call(parsed, "target")
      && Object.prototype.hasOwnProperty.call(parsed, "found_index")
    ) {
      return parsed.found_index >= 0
        ? `Tìm thấy ${parsed.target} tại vị trí ${parsed.found_index}`
        : `Không tìm thấy ${parsed.target}`;
    }
  } catch {
    return formatData(value);
  }

  return formatData(value);
};

export default function SimulationHistoryPage() {
  const {
    simulations = [],
    loading,
    simulationError,
    fetchSimulations,
    removeSimulation,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [algorithmFilter, setAlgorithmFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const algorithms = useMemo(() => {
    const map = new Map();
    simulations.forEach((simulation) => {
      map.set(
        String(simulation.algorithm_id),
        simulation.algorithm_name || `Thuật toán #${simulation.algorithm_id}`
      );
    });
    return Array.from(map, ([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [simulations]);

  const filteredSimulations = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return simulations.filter((simulation) => {
      const matchesAlgorithm =
        algorithmFilter === "all" || String(simulation.algorithm_id) === algorithmFilter;
      const searchable = [
        simulation.user_name,
        simulation.username,
        simulation.algorithm_name,
        simulation.input_data,
        simulation.sorted_result,
        simulation.user_id,
        simulation.algorithm_id,
      ].join(" ").toLowerCase();
      return matchesAlgorithm && (!keyword || searchable.includes(keyword));
    });
  }, [simulations, search, algorithmFilter]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayCount = simulations.filter((simulation) => {
      const date = new Date(simulation.executed_at);
      return !Number.isNaN(date.getTime()) && date.toDateString() === today;
    }).length;
    const averageTime = simulations.length
      ? simulations.reduce((sum, item) => sum + Number(item.execution_time_ms || 0), 0) /
        simulations.length
      : 0;
    return { todayCount, averageTime };
  }, [simulations]);

  const totalPages = Math.max(1, Math.ceil(filteredSimulations.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleSimulations = filteredSimulations.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const updateAlgorithmFilter = (value) => {
    setAlgorithmFilter(value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeSimulation(deleteTarget.id);
    } catch {
      return;
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="simulation-history-page">
      <div className="simulation-history-header">
        <div>
          <span className="simulation-eyebrow">Quản trị dữ liệu</span>
          <h1>Lịch sử mô phỏng</h1>
        </div>
        <button className="simulation-refresh-btn" onClick={fetchSimulations} disabled={loading}>
          <FiRefreshCw />
          {loading ? "Đang tải" : "Làm mới"}
        </button>
      </div>

      <div className="simulation-stats">
        <div className="simulation-stat-card">
          <FiActivity />
          <span>Tổng lượt mô phỏng</span>
          <strong>{formatNumber(simulations.length)}</strong>
        </div>
        <div className="simulation-stat-card">
          <FiClock />
          <span>Thực hiện hôm nay</span>
          <strong>{formatNumber(stats.todayCount)}</strong>
        </div>
        <div className="simulation-stat-card">
          <FiZap />
          <span>Thời gian trung bình</span>
          <strong>{stats.averageTime.toFixed(1)} ms</strong>
        </div>
      </div>

      <div className="simulation-table-card">
        <div className="simulation-toolbar">
          <input
            type="search"
            placeholder="Tìm người dùng, thuật toán, dữ liệu..."
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
          />
          <select
            value={algorithmFilter}
            onChange={(event) => updateAlgorithmFilter(event.target.value)}
          >
            <option value="all">Tất cả thuật toán</option>
            {algorithms.map((algorithm) => (
              <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>
            ))}
          </select>
        </div>

        {loading && simulations.length === 0 ? (
          <div className="simulation-state">Đang tải lịch sử...</div>
        ) : simulationError ? (
          <div className="simulation-state error">{simulationError}</div>
        ) : (
          <>
            <div className="simulation-table-scroll">
              <table className="simulation-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Thuật toán</th>
                    <th>Đầu vào</th>
                    <th>Kết quả</th>
                    <th>Bước</th>
                    <th>So sánh</th>
                    <th>Hoán đổi</th>
                    <th>Thời gian</th>
                    <th>Ngày thực hiện</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visibleSimulations.map((simulation) => (
                    <tr key={simulation.id}>
                      <td>
                        <strong>{simulation.user_name || `User #${simulation.user_id}`}</strong>
                        {simulation.username && <small>@{simulation.username}</small>}
                      </td>
                      <td>
                        <span className="algorithm-chip">
                          {simulation.algorithm_name || `Thuật toán #${simulation.algorithm_id}`}
                        </span>
                      </td>
                      <td><code title={formatData(simulation.input_data)}>{formatData(simulation.input_data)}</code></td>
                      <td><code title={formatResult(simulation.sorted_result)}>{formatResult(simulation.sorted_result)}</code></td>
                      <td>{formatNumber(simulation.steps)}</td>
                      <td>{formatNumber(simulation.comparisons)}</td>
                      <td>{formatNumber(simulation.swaps)}</td>
                      <td>{formatNumber(simulation.execution_time_ms)} ms</td>
                      <td>{formatDate(simulation.executed_at)}</td>
                      <td>
                        <button
                          className="simulation-delete-btn"
                          title="Xóa lịch sử"
                          onClick={() => setDeleteTarget(simulation)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visibleSimulations.length === 0 && (
                    <tr><td colSpan="10" className="simulation-empty">Không tìm thấy lịch sử phù hợp.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="simulation-pagination">
              <span>{filteredSimulations.length} bản ghi</span>
              <div>
                <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>← Trước</button>
                <span>Trang {safePage} / {totalPages}</span>
                <button disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>Sau →</button>
              </div>
            </div>
          </>
        )}
      </div>

      {deleteTarget && (
        <div className="simulation-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="simulation-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Xóa lịch sử mô phỏng</h3>
            <p>Bản ghi #{deleteTarget.id} sẽ bị xóa vĩnh viễn. Bạn có chắc chắn?</p>
            <div>
              <button className="cancel" onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button className="confirm" onClick={handleDelete}>Xóa lịch sử</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
