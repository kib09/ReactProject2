import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // Firebase 설정 파일 import
import { getDocs, collection } from "firebase/firestore";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "addTest"));
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        setError("데이터 로드 실패");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold">Firestore 데이터</h1>
      <ul className="space-y-4">
        {data.map((item) => (
          <li
            key={item.id}
            className="p-4 bg-white border border-gray-300 rounded-lg shadow-md"
          >
            {/* item 객체의 내용을 원하는 형태로 출력
            데이터는 객체형태로 저장되어 있기 때문에 
            firestore에서 가져온 데이터를 화면에 출력하는 부분
            각 객체의 키-값을 반복적으로 출력 
            예를 들어서 name: hi , age:15
            -> Object.entries가 여기까지 뽑아줌
             [["name","hi"],["age",15]]  
            -> map[key,value]
            배열 요소를 구주 분해하여 key , value 변수로 사용하는 형태로 
             데이터들을 출력*/}
            {Object.entries(item).map(([key, value]) => (
              <p key={key} className="text-gray-700">
                <span className="font-bold">{key}:</span>{" "}
                {JSON.stringify(value)}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
