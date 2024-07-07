import BuiltOnHedera from "@/assets/built-on-hedera.svg";

export default function Footer() {
  return (
    <div className='flex flex-col'>
      <div className='footer'>
          <img 
            src={BuiltOnHedera}
            alt='An upper case H with a line through the top and the text Build on Hedera'
            className='builtOnHederaSVG'
          />
      </div>
    </div>
  );
}