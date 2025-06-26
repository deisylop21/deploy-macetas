import hoja from "../../../../assets/images/hoja.svg";
import hoja2 from "../../../../assets/images/hoja2.svg";

type AuthGreenPanelProps = {
    title?: string;
    subtitle?: string;
};

const AuthGreenPanel = ({
                            title = "Logo",
                            subtitle = "Jardín Digital"
                        }: AuthGreenPanelProps) => (
    <div className="hidden md:flex w-1/2 bg-green-600 relative overflow-hidden flex-col items-center justify-center">
        <img
            src={hoja2}
            alt="Hoja izquierda"
            className="absolute top-0 left-0 h-auto w-[55%] max-w-[240px] min-w-[80px] md:block hidden pointer-events-none select-none"
            style={{ zIndex: 0, top: '-50px', left: '-60px', transform: "rotate(10deg)" }}
        />
        <img
            src={hoja}
            alt="Hoja izquierda media"
            className="absolute left-0 h-auto w-[55%] max-w-[200px] min-w-[80px] md:block hidden pointer-events-none select-none"
            style={{ zIndex: 0, top: '230px', left: '-30px', transform: "rotate(170deg)" }}
        />
        <img
            src={hoja}
            alt="Hoja"
            className="absolute top-0 right-0 h-auto w-[60%] max-w-[220px] min-w-[120px] md:block hidden pointer-events-none select-none"
            style={{ zIndex: 0 }}
        />
        <img
            src={hoja}
            alt="Hoja acostada"
            style={{ transform: "rotate(-55deg)", zIndex: 0, right: '-155px' }}
            className="absolute top-[65%] h-auto w-[50%] max-w-[230px] min-w-[80px] md:block hidden pointer-events-none select-none"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
            <div className="text-6xl font-extrabold text-white mb-2">{title}</div>
            <div className="text-2xl font-semibold text-white tracking-wide">
                {subtitle}
            </div>
        </div>
    </div>
);

export default AuthGreenPanel;