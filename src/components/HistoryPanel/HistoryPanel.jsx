import "./HistoryPanel.css";

const HistoryPanel = () => {
    const historyData = [
        {
            step: 1,
            description: "Vòng lặp ngoài i=0: tìm phần tử nhỏ nhất từ vị trí 0",
            array: "[64, 34, 25, 12, 22, 11, 90]",
        },
        {
            step: 2,
            description: "So sánh a[1]=34 với a[0]=64",
            array: "[64, 34, 25, 12, 22, 11, 90]",
        },
        {
            step: 3,
            description: "So sánh a[2]=25 với a[1]=34",
            array: "[64, 34, 25, 12, 22, 11, 90]",
        },
        {
            step: 4,
            description: "So sánh a[3]=12 với a[2]=25",
            array: "[64, 34, 25, 12, 22, 11, 90]",
        },
        {
            step: 5,
            description: "Tìm thấy minIdx = 3 (giá trị 12)",
            array: "[64, 34, 25, 12, 22, 11, 90]",
        },
        {
            step: 6,
            description: "So sánh a[5]=11 với a[3]=12",
            array: "[64, 34, 25, 12, 22, 11, 90]",
        },
    ];

    return (
        <div className="history-panel">
            <div className="history-header">
                <span className="history-title">
                    Lịch sử
                </span>

                <span className="history-badge">
                    {historyData.length} bước
                </span>
            </div>

            <div className="history-content">
                <div className="history-list">
                    {historyData.map((item, index) => (
                        <div
                            key={item.step}
                            className={`history-item ${index === historyData.length - 1
                                    ? "active"
                                    : ""
                                }`}
                        >
                            <span className="history-step">
                                #{item.step}
                            </span>

                            <div className="history-info">
                                <div className="history-description">
                                    {item.description}
                                </div>

                                <div className="history-array">
                                    {item.array}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default HistoryPanel;