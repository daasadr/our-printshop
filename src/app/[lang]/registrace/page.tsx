'use client';

import { useState, useRef, useEffect } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import Image from 'next/image';

interface RegisterPageProps {
  params: {
    lang: string;
  };
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const [dict, setDict] = useState<any>(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragged, setIsDragged] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        let dictionary;
        switch (params.lang) {
          case 'cs':
            dictionary = {
              auth: {
                register: {
                  title: "Registrace",
                  subtitle: "Vytvořte si účet a získejte přístup k exkluzivním nabídkám",
                  name: "Jméno či přezdívka",
                  email: "E-mail",
                  password: "Heslo",
                  confirmPassword: "Potvrďte heslo",
                  gdprConsent: "Souhlasím se zpracováním osobních údajů",
                  registerButton: "Registrovat",
                  loginLink: "Již máte účet?",
                  loginButton: "Přihlaste se",
                  errors: {
                    required: "Toto pole je povinné",
                    invalidEmail: "Zadejte platný e-mail",
                    passwordMismatch: "Hesla se neshodují",
                    passwordTooShort: "Heslo musí mít alespoň 6 znaků",
                    general: "Nastala chyba při registraci"
                  },
                  success: {
                    title: "Registrace úspěšná",
                    message: "Váš účet byl úspěšně vytvořen"
                  }
                }
              }
            };
            break;
          case 'sk':
            dictionary = {
              auth: {
                register: {
                  title: "Registrácia",
                  subtitle: "Vytvorte si účet a získajte prístup k exkluzívnym ponukám",
                  name: "Meno alebo prezývka",
                  email: "E-mail",
                  password: "Heslo",
                  confirmPassword: "Potvrďte heslo",
                  gdprConsent: "Súhlasím so spracovaním osobných údajov",
                  registerButton: "Registrovať",
                  loginLink: "Už máte účet?",
                  loginButton: "Prihláste sa",
                  errors: {
                    required: "Toto pole je povinné",
                    invalidEmail: "Zadajte platný e-mail",
                    passwordMismatch: "Heslá sa nezhodujú",
                    passwordTooShort: "Heslo musí mať aspoň 6 znakov",
                    general: "Nastala chyba počas registrácie"
                  },
                  success: {
                    title: "Registrácia úspešná",
                    message: "Váš účet bol úspešne vytvorený"
                  }
                }
              }
            };
            break;
          case 'de':
            dictionary = {
              auth: {
                register: {
                  title: "Registrierung",
                  subtitle: "Erstellen Sie ein Konto und erhalten Sie Zugang zu exklusiven Angeboten",
                  name: "Name oder Spitzname",
                  email: "E-Mail",
                  password: "Passwort",
                  confirmPassword: "Passwort bestätigen",
                  gdprConsent: "Ich stimme der Verarbeitung personenbezogener Daten zu",
                  registerButton: "Registrieren",
                  loginLink: "Haben Sie bereits ein Konto?",
                  loginButton: "Anmelden",
                  errors: {
                    required: "Dieses Feld ist erforderlich",
                    invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein",
                    passwordMismatch: "Passwörter stimmen nicht überein",
                    passwordTooShort: "Passwort muss mindestens 6 Zeichen lang sein",
                    general: "Bei der Registrierung ist ein Fehler aufgetreten"
                  },
                  success: {
                    title: "Registrierung erfolgreich",
                    message: "Ihr Konto wurde erfolgreich erstellt"
                  }
                }
              }
            };
            break;
          case 'en':
            dictionary = {
              auth: {
                register: {
                  title: "Registration",
                  subtitle: "Create an account and get access to exclusive offers",
                  name: "Name or nickname",
                  email: "Email",
                  password: "Password",
                  confirmPassword: "Confirm password",
                  gdprConsent: "I agree to the processing of personal data",
                  registerButton: "Register",
                  loginLink: "Already have an account?",
                  loginButton: "Sign in",
                  errors: {
                    required: "This field is required",
                    invalidEmail: "Please enter a valid email address",
                    passwordMismatch: "Passwords do not match",
                    passwordTooShort: "Password must be at least 6 characters long",
                    general: "An error occurred during registration"
                  },
                  success: {
                    title: "Registration successful",
                    message: "Your account has been successfully created"
                  }
                }
              }
            };
            break;
          default:
            dictionary = {
              auth: {
                register: {
                  title: "Registrace",
                  subtitle: "Vytvořte si účet a získejte přístup k exkluzivním nabídkám",
                  name: "Jméno či přezdívka",
                  email: "E-mail",
                  password: "Heslo",
                  confirmPassword: "Potvrďte heslo",
                  gdprConsent: "Souhlasím se zpracováním osobních údajů",
                  registerButton: "Registrovat",
                  loginLink: "Již máte účet?",
                  loginButton: "Přihlaste se",
                  errors: {
                    required: "Toto pole je povinné",
                    invalidEmail: "Zadejte platný e-mail",
                    passwordMismatch: "Hesla se neshodují",
                    passwordTooShort: "Heslo musí mít alespoň 6 znaků",
                    general: "Nastala chyba při registraci"
                  },
                  success: {
                    title: "Registrace úspěšná",
                    message: "Váš účet byl úspěšně vytvořen"
                  }
                }
              }
            };
        }
        setDict(dictionary);
      } catch (error) {
        console.error('Error loading dictionary:', error);
        // Fallback na český slovník
        setDict({
          auth: {
            register: {
              title: "Registrace",
              subtitle: "Vytvořte si účet a získejte přístup k exkluzivním nabídkám",
              name: "Jméno či přezdívka",
              email: "E-mail",
              password: "Heslo",
              confirmPassword: "Potvrďte heslo",
              gdprConsent: "Souhlasím se zpracováním osobních údajů",
              registerButton: "Registrovat",
              loginLink: "Již máte účet?",
              loginButton: "Přihlaste se",
              errors: {
                required: "Toto pole je povinné",
                invalidEmail: "Zadejte platný e-mail",
                passwordMismatch: "Hesla se neshodují",
                passwordTooShort: "Heslo musí mít alespoň 6 znaků",
                general: "Nastala chyba při registraci"
              },
              success: {
                title: "Registrace úspěšná",
                message: "Váš účet byl úspěšně vytvořen"
              }
            }
          }
        });
      }
    };
    loadDictionary();
  }, [params.lang]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      setDragStart({ x: offsetX, y: offsetY });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setModalPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsDragged(true);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  if (!dict) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen relative overflow-y-auto bg-black">
      {/* Background image - much darker */}
      <div className="absolute inset-0">
        <Image
          src="/images/b2.jpg"
          alt="Dark background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Hyene image positioned top-left with offset */}
      <div className="absolute top-16 left-16 w-1/2 h-auto z-10">
        <div className="relative w-full">
          <Image
            src="/images/hyene.jpg"
            alt="Hyena"
            width={800}
            height={600}
            className="w-full h-auto object-cover rounded-2xl shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Content overlay with parallax and better positioning */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Title and subtitle - responsive positioning */}
        <div className="sm:absolute sm:right-8 sm:top-20 w-full max-w-md animate-fade-in-up sm:max-w-md max-w-sm mx-auto px-4 sm:px-0">
          <h2 className="registration-title mt-6 text-center text-3xl font-extrabold text-white drop-shadow-lg">
            {dict.auth.register.title}
          </h2>
          <p className="registration-subtitle mt-2 text-center text-sm text-purple-300 drop-shadow-lg shadow-black/80 filter drop-shadow-[0_0_10px_rgba(0,0,0,0.9)]">
            {dict.auth.register.subtitle}
          </p>
        </div>

        {/* Modal - responsive positioning and sizing with drag functionality */}
        <div 
          ref={modalRef}
          className={`w-full max-w-md animate-fade-in-up animation-delay-200 sm:max-w-md max-w-sm mx-auto px-4 sm:px-0 ${
            isDragged 
              ? 'fixed' 
              : 'absolute right-8 top-[35rem] sm:right-8 sm:top-[35rem] right-0 top-12'
          }`}
          style={{
            position: isDragged ? 'fixed' : 'absolute',
            left: isDragged ? `${modalPosition.x}px` : 'auto',
            top: isDragged ? `${modalPosition.y}px` : 'auto',
            zIndex: isDragged ? 50 : 'auto'
          }}
        >
          <div className="registration-modal bg-gradient-to-br from-purple-950/70 to-purple-900/70 backdrop-blur-2xl py-4 px-4 shadow-2xl sm:rounded-2xl sm:px-8 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 shadow-purple-600/40 hover:shadow-purple-600/50 sm:py-6 sm:px-8 py-3 px-3 select-none">
            {/* Drag handle - only the purple border area */}
            <div 
              className="absolute inset-0 rounded-2xl cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              style={{ pointerEvents: 'all' }}
            />
            {/* Form content - no drag functionality */}
            <div style={{ pointerEvents: 'all', position: 'relative', zIndex: 1 }}>
              <RegisterForm dict={dict.auth.register} lang={params.lang} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 