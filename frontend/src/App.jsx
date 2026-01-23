import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const API_BASE = "http://localhost:8000/api/workout";

function App() {
  const [workoutId, setID] = useState('1');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [logTime, setLogTime] = useState(new Date().toISOString().slice(0, 16));
  const [workoutList, setWorkoutList] = useState([]);
  const [progress, setProgress] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredWorkouts = workoutList.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const selectedWorkoutName = workoutList.find(w => w.id.toString() === workoutId.toString())?.name || "Select exercise...";

  const loadData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/${workoutId}/progress`);
      const formattedData = res.data.map(item => ({
        ...item,
        created_at: new Date(item.created_at).getTime()
      }));
      setProgress(formattedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setProgress([]);
    }
  };

  useEffect(() => {
    void loadData();
  }, [workoutId]);

  const loadWorkoutList = async () => {
    try {
      const res = await axios.get(`${API_BASE}/all`);
      setWorkoutList(res.data);
    } catch (err) {
      console.error("Couldn't load workout list", err);
    }
  };

  useEffect(() => {
    void loadWorkoutList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || !reps) return;
    try {
      await axios.post(`${API_BASE}/log`, {
        workout_id: parseInt(workoutId),
        weight: parseFloat(weight),
        reps: parseInt(reps),
        created_at: logTime
      });
      setLogTime(new Date().toISOString().slice(0, 16));
      setWeight('');
      setReps('');
      await loadData();
    } catch (err) {
      console.error("Log failed:", err);
    }
  };

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/create`, {name: newWorkoutName});
      await loadWorkoutList();
      setID(res.data.id.toString());
      setNewWorkoutName('');
    } catch (err) {
      console.error(err);
    }
  };


  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#64748b',
    marginBottom: '8px'
  };

  const inputStyle = {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    padding: '32px',
    marginBottom: '24px',
    border: '1px solid #f1f5f9',
    height: '100%' 
  };

  return (
      <div style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '40px 40px',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Container width set to 95% or a very high max-width
          to fill the screen while maintaining some "breathable" margins.
      */}
        <div style={{maxWidth: '1600px', margin: '0 auto', width: '95%'}}>

          {/* Header - Stretches across the top */}
          <header
              style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h1 style={{fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.025em'}}>
                Progressive Overload
              </h1>
              <p style={{color: '#64748b', fontSize: '18px', marginTop: '4px'}}>Data-driven performance tracking.</p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              padding: '10px 20px',
              borderRadius: '12px',
              gap: '20px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'

            }}>
              <div style={{...labelStyle, marginBottom: 0}}>Exercise:</div>



              <div style={{ position: 'relative', minWidth: '194px'}}>

              {/* The Search / Display Box */}
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  ...inputStyle,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  fontWeight: '600',
                  color: '#0f172a'
                }}
              >
                {selectedWorkoutName}
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{isDropdownOpen ? '▲' : '▼'}</span>
              </div>

              {/* The Floating Search Menu */}
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 100,
                  marginTop: '8px',
                  background: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}>
                  {/* Search Input inside the dropdown */}
                  <input
                    autoFocus
                    placeholder="Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()} 
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#fff',
                      color: '#0f172a',
                      border: 'none',
                      borderBottom: '1px solid #f1f5f9',
                      outline: 'none',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />

                  {/* Options List */}
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {filteredWorkouts.length > 0 ? (
                      filteredWorkouts.map((workout) => (
                        <div
                          key={workout.id}
                          onClick={() => {
                            setID(workout.id.toString());
                            setIsDropdownOpen(false);
                            setSearchTerm(''); 
                          }}
                          style={{
                            padding: '10px 15px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: workoutId.toString() === workout.id.toString() ? '#2563eb' : '#1e293b',
                            backgroundColor: workoutId.toString() === workout.id.toString() ? '#eff6ff' : 'transparent',
                            transition: 'background 0.2s',
                            fontWeight: workoutId.toString() === workout.id.toString() ? '700' : '400'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = workoutId.toString() === workout.id.toString() ? '#eff6ff' : 'transparent'}
                        >
                          {workout.name}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '15px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                        No results found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            </div>
          </header>

          {/* Main Grid - Using fr units to give the graph more priority.
            1fr for sidebar (approx 25%), 3fr for main (approx 75%)
        */}
          <div style={{display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '32px', alignItems: 'start'}}>

            <main style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
              {/* Expanded Graph Card */}
              <section style={cardStyle}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '32px'
                }}>
                  <h3 style={{fontSize: '30px', fontWeight: '700', color: '#1e293b'}}>Exercise Progression</h3>
                  <div style={{
                    color: '#2563eb',
                    fontWeight: '600',
                    fontSize: '14px',
                    backgroundColor: '#eff6ff',
                    padding: '6px 12px',
                    borderRadius: '20px'
                  }}>
                    {progress.length} Total Sets Logged
                  </div>
                </div>

                <div style={{height: '500px', width: '100%'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progress} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                      <defs>
                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                      <XAxis
                          dataKey="created_at"
                          type="number"
                          scale="time"
                          domain={['auto', 'auto']}
                          tickFormatter={(t) => new Date(t).toLocaleDateString()}
                          stroke="#94a3b8"
                          fontSize={13}
                          tickMargin={10}
                      />
                      <YAxis
                          stroke="#94a3b8"
                          fontSize={13}
                          domain={['auto', 'auto']}
                          tickMargin={10}
                          label={{
                            value: 'Weight (lbs)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 10,
                            style: {fill: '#94a3b8', fontSize: '12px', fontWeight: 'bold'}
                          }}
                      />
                      <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                          }}
                          labelFormatter={(t) => new Date(t).toLocaleString()}
                      />
                      <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="#2563eb"
                          strokeWidth={4}
                          fillOpacity={1}
                          fill="url(#colorWeight)"
                          dot={{fill: '#2563eb', r: 5, strokeWidth: 2, stroke: '#fff'}}
                          activeDot={{r: 8, strokeWidth: 0}}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Dash-Bordered Creation Area */}
              <section style={{
                ...cardStyle,
                background: '#fff',
                border: '2px dashed #cbd5e1',
                boxShadow: 'none',
                padding: '20px 32px'
              }}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '20px'}}>
                  <p style={{...labelStyle, marginBottom: 0, whiteSpace: 'nowrap'}}>Create Exercise</p>
                  <form onSubmit={handleCreateWorkout} style={{display: 'flex', gap: '12px', flex: 1}}>
                    <input
                        type="text"
                        placeholder="Enter exercise name..."
                        value={newWorkoutName}
                        onChange={(e) => setNewWorkoutName(e.target.value)}
                        style={{...inputStyle, flex: 1, backgroundColor: '#f8fafc', color: '#0f172a', 
                        border: '1px solid #e2e8f0'}}
                    />
                    <button type="submit" style={{
                      padding: '0 24px',
                      backgroundColor: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Create
                    </button>
                  </form>
                </div>
              </section>
            </main>

            {/* Sidebar - Log Entry */}
            <aside style={{height: '73.2%'}}>
              <section
                  style={{...cardStyle, backgroundColor: '#fff', color: '#1e293b', position: 'sticky', top: '40px'}}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  borderBottom: '1px solid #1e293b',
                  paddingBottom: '16px'
                }}>
                  Log New Set
                </h3>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  <div>
                    <label style={{...labelStyle, color: '#94a3b8'}}>Load (lbs)</label>
                    <input
                        type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                        style={{
                          ...inputStyle,
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: '#f7f7f7',
                          border: '1px solid #ededed',
                          color: '#0f172a',
                          fontSize: '18px'
                        }}
                    />
                  </div>
                  <div>
                    <label style={{...labelStyle, color: '#94a3b8'}}>Repetitions</label>
                    <input
                        type="number" value={reps} onChange={(e) => setReps(e.target.value)}
                        style={{
                          ...inputStyle,
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: '#f7f7f7',
                          border: '1px solid #ededed',
                          color: '#0f172a',
                          fontSize: '18px'
                        }}
                    />
                  </div>
                  <div>
                    <label style={{...labelStyle, color: '#94a3b8'}}>Session Time</label>
                    <input
                        type="datetime-local" value={logTime} onChange={(e) => setLogTime(e.target.value)}
                        style={{
                          ...inputStyle,
                          width: '100%',
                          boxSizing: 'border-box',
                          backgroundColor: '#f7f7f7',
                          border: '1px solid #ededed',
                          color: '#0f172a'
                        }}
                    />
                  </div>
                  <button type="submit" style={{
                    marginTop: '12px',
                    padding: '16px',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
                  }}>
                    Commit Set
                  </button>
                </form>
              </section>
            </aside>

          </div>
        </div>
      </div>
  );
}
export default App;
