import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import fetchTransfersByPharmacyID from '../../services/transfers/getTransfersByPharmacyID';
import { useFetchByID } from '../../hooks/useFetchByID';
import Chart from "react-apexcharts";
import { formatDate } from '../../utils/dateUtils';
import { IoFilterSharp } from "react-icons/io5";
import Card from '../Card/Card';
import { DailyTransfer, Transfer } from '../../types/transfer';
import TransferFilter from '../TransferFilter/TransferFilter';
import './Dashboard.css'

function Dashboard() {
  const user = useSelector((state: RootState) => state.user.user);
  const [toggleFilter, setToggleFilter] = useState(false);
  
  const { 
    data: transfersData, 
    isLoading, 
    isError 
  } = useFetchByID({
    queryKey: "transfers",
    queryFn: fetchTransfersByPharmacyID,
    id: user?.pharmacy_id,
  });
  
  // Memoize transfers data and filtered sets
  const { transfers, transfersSent, transfersReceived } = useMemo(() => {
    const transfers = transfersData?.transfers || [];
    return {
      transfers,
      transfersSent: transfers.filter(
        (transfer: any) => transfer.to_pharmacy.id === user?.pharmacy_id
      ),
      transfersReceived: transfers.filter(
        (transfer: any) => transfer.from_pharmacy.id === user?.pharmacy_id
      )
    };
  }, [transfersData, user?.pharmacy_id]);

  const [transferFilter, setTransferFilter] = useState<Transfer[]>(transfers);

  // Memoize status counts
  const statusCounts = useMemo(() => {
    return transferFilter.reduce((acc, transfer: Transfer) => {
      acc[transfer.transfer_status]++;
      return acc;
    }, {
      completed: 0,
      in_progress: 0,
      pending: 0,
      cancelled: 0
    });
  }, [transferFilter]);

  // Memoize daily transfers data
  const sortedDailyTransfers = useMemo(() => {
    const dailyTransfers = transferFilter.reduce((acc: Record<string, DailyTransfer>, transfer) => {
      const dateKey = formatDate(transfer.created_at).formattedDate;
      const shortDateKey = formatDate(transfer.created_at).formattedMonthYear;
      const status = transfer.transfer_status as keyof Omit<DailyTransfer, 'date'>;
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: shortDateKey,
          completed: 0,
          in_progress: 0,
          pending: 0,
          cancelled: 0
        };
      }
      
      acc[dateKey][status]++;
      return acc;
    }, {});

    return (Object.values(dailyTransfers) as DailyTransfer[])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transferFilter]);

  // Memoize chart configurations
  const { barChartData, donutChartData } = useMemo(() => ({
    barChartData: {
      options: {
        chart: {
          id: "daily-transfers",
          stacked: true,
        },
        xaxis: {
          categories: sortedDailyTransfers.map(day => day.date),
          title: { text: 'Date' }
        },
        yaxis: {
          title: { text: 'Number of Transfers' }
        },
        legend: {
          position: 'top' as const
        },
        colors: ['#B9FBC0', '#A0C4FF', '#FFF3B0', '#FFADAD'],
        tooltip: {
          shared: true,
          intersect: false
        }
      },
      series: [
        { name: 'Completed', data: sortedDailyTransfers.map(day => day.completed) },
        { name: 'In Progress', data: sortedDailyTransfers.map(day => day.in_progress) },
        { name: 'Pending', data: sortedDailyTransfers.map(day => day.pending) },
        { name: 'Cancelled', data: sortedDailyTransfers.map(day => day.cancelled) }
      ]
    },
    donutChartData: {
 options: {
      chart: {
        type: 'donut' as const, // Explicitly type as 'donut'
        width: '50%',
      },
      labels: ['Completed', 'In Progress', 'Pending', 'Cancelled'],
      colors: ['#B9FBC0', '#A0C4FF', '#FFF3B0', '#FFADAD'],
      legend: {
        position: 'left' as const,
      },
      responsive: [{
        breakpoint: 1200,
        options: {
          chart: {
            width: '100%'
          },
          legend: {
            position: 'top' as const
          }
        }
      }]
    },
      series: [
        statusCounts.completed,
        statusCounts.in_progress,
        statusCounts.pending,
        statusCounts.cancelled
      ]
    }
  }), [sortedDailyTransfers, statusCounts, transferFilter.length]);

  if (isLoading) return <div>Loading transfers...</div>;
  if (isError) return <div>Error loading transfers</div>;

  return (
    <div className='Dashboard'>
      <div className='dashboard-header'>
        <h3>Dashboard</h3>
        <button onClick={() => setToggleFilter(prev => !prev)}>
          {IoFilterSharp({})}
        </button>
        {toggleFilter && (
          <TransferFilter 
            currentFilter={transferFilter}
            onFilterChange={setTransferFilter}
            setToggleFilter={setToggleFilter}
            filters={{
              all: transfers,
              sent: transfersSent,
              received: transfersReceived
            }}
          />
        )}
      </div>
      
      <div className='pharmacy-analytics'>
        <Card 
          title="Completed Transfers"
          number={statusCounts.completed}
          icon="FaFilePrescription"
          color="#B9FBC0"
        />
        <Card 
          title="Transfers In Progress"
          number={statusCounts.in_progress}
          icon="FaFilePrescription"
          color="#A0C4FF"
        />
        <Card 
          title="Pending Transfers"
          number={statusCounts.pending}
          icon="FaFilePrescription"
          color="#FFF3B0"
        />
        <Card 
          title="Cancelled Transfers"
          number={statusCounts.cancelled}
          icon="FaFilePrescription"
          color="#FFADAD"
        />
      </div>

      <div className='chart-grid'>
        <div className='chart-donut'>
          <h3>Status Distribution</h3>
          <Chart
            options={donutChartData.options}
            series={donutChartData.series}
            type="donut"
            height={350}
          />
        </div>

        <div className='chart-bar'>
          <h3>Daily Transfers</h3>
          <Chart
            options={barChartData.options}
            series={barChartData.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;