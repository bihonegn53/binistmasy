import React, { useState, useEffect } from 'react';

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ተጠቃሚዎችን እና ሚናዎቻቸውን ከሰርቨር ማምጣት
  useEffect(() => {
    fetch('http://localhost:5000/api/users') // የሰርቨርዎ ማمሪያ (endpoint) ትክክለኛ መሆኑን ያረጋግጡ
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => console.error('ስህተት ተፈጥሯል:', err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">የተጠቃሚዎች ሚና ማስተዳደሪያ (Role Management)</h1>
      
      {loading ? (
        <p>እየጫነ ነው...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">ስም (Name)</th>
              <th className="border border-gray-300 p-2">ኢሜል (Email)</th>
              <th className="border border-gray-300 p-2">ሚና (Role)</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2 font-semibold text-blue-600">
                  {user.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}