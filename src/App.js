import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

function App() {
  const [data, setData] = useState(null);
  const [value, setValue] = useState([]);
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=12&page=1&sparkline=false&";

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //   console.log(data);
  if (!data) return null;

  const fetchItems = async (currentPage) => {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=12&page=${currentPage}&sparkline=false`
    );
    const data = await res.json();
    return data;
  };

  const handlePageClick = async (data) => {
    console.log(data.selected);

    let currentPage = data.selected + 1;

    const itemsFromServer = await fetchItems(currentPage);
    setData(itemsFromServer);
  };

  const loadData = async () => {
    return await axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=12&page=1&sparkline=false&"
      )
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));
  };

  console.log("data", data);
  const handleReset = () => {
    loadData();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    return await axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&ids=${value}`
      )
      .then((response) => {
        setData(response.data);
        setValue("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="main">
      <div class="container">
        <form className="d-flex" onSubmit={handleSearch}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Search by Name..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className="form-row">
            <button type="submit" className="btn">
              Search
            </button>
          </div>

          <div className="form-row">
            <button className="btn" onClick={() => handleReset()}>
              Reset
            </button>
          </div>
        </form>
      </div>
      <div class="list container">
        {data.map((item) => {
          return (
            <div className="allitems">
              <div className="top">
                <div>
                  <img src={item.image} alt="/" />
                </div>
                <div>
                  <h5>{item.name}</h5>
                </div>
              </div>

              <div>
                <h5>Rs.{item.current_price.toLocaleString()}</h5>
              </div>
              <div>
                {item.price_change_percentage_24h < 0 ? (
                  <span className="red">
                    {item.price_change_percentage_24h.toFixed(2)}%
                  </span>
                ) : (
                  <span className="green">
                    {item.price_change_percentage_24h.toFixed(2)}%
                  </span>
                )}
              </div>
              <div>
                <h5>Rs.{item.market_cap.toLocaleString()}</h5>
              </div>
            </div>
          );
        })}
      </div>

      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={25}
        marginPagesDisplayed={3}
        pageRangeDisplayed={6}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center m-3 p-2"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default App;
