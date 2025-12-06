export const SAMPLES = [
    {
      category: "React Components",
      name: "Messy User Card (Inline Styles)",
      code: `const UserCard = ({ name, role, avatar }) => {
    return (
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', textAlign: 'center', fontFamily: 'Arial', maxWidth: '300px', margin: '0 auto', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
        <center>
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" style={{ borderRadius: '50%', width: '100px', height: '100px', border: '5px solid white', boxShadow: '0 0 10px #ccc' }} />
        </center>
        <h2 style={{ color: '#333', margin: '10px 0' }}>{name || "John Doe"}</h2>
        <p style={{ color: 'gray', fontSize: '14px' }}>{role || "Developer"}</p>
        <div style={{ marginTop: '20px' }}>
           <button style={{ background: 'blue', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', marginRight: '5px' }} onClick={() => alert('hi')}>Message</button>
           <button style={{ background: 'white', color: 'blue', border: '1px solid blue', padding: '10px 20px', cursor: 'pointer' }}>Follow</button>
        </div>
      </div>
    );
  }`
    },
    {
      category: "React Components",
      name: "Spaghetti Login Form",
      code: `function Login() {
    return (
      <div style={{ backgroundColor: '#f0f2f5', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '8px', width: '400px' }}>
          <h1 style={{ textAlign: 'center', color: '#1877f2' }}>FaceSpace</h1>
          <br />
          <input type="text" placeholder="Email or Phone" style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
          <br />
          <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
          <br />
          <button style={{ width: '100%', background: '#1877f2', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Log In</button>
          <br /><br />
          <center><a href="#" style={{ color: '#1877f2', textDecoration: 'none', fontSize: '14px' }}>Forgot Password?</a></center>
          <hr style={{ margin: '20px 0' }} />
          <center><button style={{ background: '#42b72a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}>Create New Account</button></center>
        </div>
      </div>
    );
  }`
    },
    {
      category: "HTML/CSS Snippets",
      name: "Div Soup Navbar",
      code: `<div style="background-color: #333; height: 60px; width: 100%; overflow: hidden; font-family: sans-serif;">
    <div style="float:left; color: white; padding: 20px; font-weight: bold; font-size: 20px;">MyBrand</div>
    <div style="float:right; padding: 15px;">
      <span style="color: white; margin-right: 20px; cursor: pointer; text-decoration: underline;" onclick="alert('home')">Home</span>
      <span style="color: #ddd; margin-right: 20px; cursor: pointer;">About Us</span>
      <span style="color: #ddd; margin-right: 20px; cursor: pointer;">Services</span>
      <span style="background: orange; padding: 10px; color: black; border-radius: 5px; cursor: pointer;">Contact</span>
    </div>
    <div style="clear:both;"></div>
  </div>`
    },
    {
      category: "HTML/CSS Snippets",
      name: "Legacy Pricing Table",
      code: `<div style="font-family: Arial, sans-serif; padding: 50px;">
  <table border="1" width="100%" cellpadding="20" cellspacing="0" style="border-collapse: collapse; text-align: center;">
    <tr style="background-color: #333; color: white;">
      <th>Basic Plan</th>
      <th style="background-color: #e67e22;">PRO Plan (Best)</th>
      <th>Enterprise</th>
    </tr>
    <tr>
      <td style="background-color: #f9f9f9;">
        <h1>$19</h1>
        <p>10 Users</p>
        <p>5GB Storage</p>
        <br>
        <button style="padding: 10px; background: #ddd; border: 1px solid #999;">Select</button>
      </td>
      <td style="border: 4px solid #e67e22; transform: scale(1.05); background: white; box-shadow: 0 0 15px rgba(0,0,0,0.2);">
        <h1 style="color: #e67e22;">$49</h1>
        <p><b>Unlimited Users</b></p>
        <p><b>100GB Storage</b></p>
        <p>24/7 Support</p>
        <br>
        <button style="padding: 15px 30px; background: #e67e22; color: white; border: none; font-size: 18px; cursor: pointer;">BUY NOW</button>
      </td>
      <td style="background-color: #f9f9f9;">
        <h1>$99</h1>
        <p>Unlimited Everything</p>
        <p>Dedicated Agent</p>
        <br>
        <button style="padding: 10px; background: #ddd; border: 1px solid #999;">Contact Sales</button>
      </td>
    </tr>
  </table>
  </div>`
    },
    {
      category: "React Components",
      name: "Broken Todo List",
      code: `const TodoList = () => {
      // Bad practice: using index as key, inline functions, mix of styles
      const todos = ['Buy milk', 'Walk dog', 'Code React'];
      return (
          <div style={{padding: 20, border: '5px double black', width: 300, background: 'yellow'}}>
              <h1 style={{textDecoration: 'underline'}}>MY LIST!!!!</h1>
              <ul>
                  {todos.map((t, i) => (
                      <li key={i} style={{listStyle: 'none', borderBottom: '1px dashed black', padding: 5}}>
                          <input type="checkbox" />
                          <span style={{marginLeft: 10, fontWeight: 'bold'}}>{t}</span>
                          <a href="#" style={{float: 'right', color: 'red'}}>x</a>
                          <div style={{clear:'both'}}></div>
                      </li>
                  ))}
              </ul>
              <br />
              <input type="text" /> <button>Add</button>
          </div>
      )
  }`
    },
    {
      category: "HTML/CSS Snippets",
      name: "Misaligned Hero Section",
      code: `<div style="width: 100%; height: 500px; background-color: #2c3e50; position: relative; overflow: hidden;">
    <div style="position: absolute; top: 150px; left: 100px; color: white; z-index: 2;">
      <h1 style="font-size: 60px; margin: 0; text-shadow: 2px 2px 0px #000;">FUTURE<br>VISION</h1>
      <p style="font-size: 24px; color: #ecf0f1; max-width: 500px;">
        We build things that look vaguely futuristic but are actually hard to maintain.
      </p>
      <br><br>
      <a href="#" style="background: #e74c3c; padding: 20px 40px; text-decoration: none; color: white; font-weight: bold; border-radius: 50px;">GET STARTED</a>
    </div>
    <div style="position: absolute; right: -50px; top: 50px; width: 400px; height: 400px; background: #34495e; border-radius: 50%; opacity: 0.5;"></div>
    <div style="position: absolute; right: 150px; bottom: -100px; width: 300px; height: 300px; background: #e74c3c; border-radius: 50%; opacity: 0.2;"></div>
  </div>`
    },
    {
      category: "HTML/CSS Snippets",
      name: "Inaccessible Contact Form",
      code: `<div style="background: #fff0f0; padding: 30px; border: 2px solid red; width: 500px; margin: 20px;">
      <h2 style="color: red; text-align: center;">SEND MESSAGE</h2>
      <br>
      NAME:<br>
      <input type="text" style="width: 100%; height: 30px;"><br><br>
      EMAIL:<br>
      <input type="text" style="width: 100%; height: 30px;"><br><br>
      YOUR MESSAGE:<br>
      <textarea style="width: 100%; height: 100px;"></textarea><br><br>
      <div style="background: red; color: white; text-align: center; padding: 10px; cursor: pointer; font-weight: bold;">SUBMIT NOW</div>
      <div style="font-size: 10px; color: #999; text-align: center; margin-top: 10px;">We will spam you.</div>
  </div>`
    },
    {
      category: "React Components",
      name: "Nested Callback Hell",
      code: `const Dashboard = () => {
    return (
      <div>
        <div className="header" style={{background:'#333', color:'#fff'}}>Header</div>
        <div className="content">
          <div className="sidebar" style={{float:'left', width:'20%'}}>
             Menu 1<br/>Menu 2<br/>Menu 3
          </div>
          <div className="main" style={{float:'right', width:'78%'}}>
             <h1>Dashboard</h1>
             <div className="card" onClick={() => {
                alert("Loading...");
                setTimeout(() => {
                   alert("Loaded!");
                }, 1000);
             }} style={{background:'#eee', padding: 20, margin: 10}}>
                Click Me for Data
             </div>
          </div>
          <div style={{clear:'both'}}></div>
        </div>
      </div>
    )
  }`
    }
  ];