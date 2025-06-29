import {Link} from "react-router-dom";

const Logo = () => (
    <Link to={'/'}>
        <div className="logo text-2xl font-bold flex-none">
            <span className="text-red-600">Рос</span>
            <span className="text-blue-600">Шкур</span>
        </div>
    </Link>
);

export default Logo;