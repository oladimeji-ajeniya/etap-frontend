"use client";
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const getToken = () => {
  return localStorage.getItem('token');
};

type User = {
  userId: number;
  name: string;
  email: string;
  totalWatchTime: number;
};

const Dashboard = () => {
  const [rankedUsers, setRankedUsers] = useState<User[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankedUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/video-progress`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch ranked users');
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          setRankedUsers(data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Something went wrong');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRankedUsers();
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl text-black font-bold mb-8">Admin Dashboard</h1>

      <div className="flex space-x-4 mb-8">
        <Link href="/subject/create" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
          Add Subject
        </Link>
        <Link href="/topic/create" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
          Add Topic
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Ranked Users</h2>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Total Watch Time</th>
              </tr>
            </thead>
            <tbody>
              {rankedUsers.map((user) => (
                <tr key={user.userId} className="border-t">
                  <td className="px-4 py-2">{user.userId}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.totalWatchTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
