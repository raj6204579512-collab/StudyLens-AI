import { useState, useEffect } from "react";
import "./StudentDashboard.css";

const API_URL = "https://studylens-ai-tx6o.onrender.com";

const subjects = [
  { name: "Physics", icon: "⚡", color: "#e7efff", accent: "#3b82f6" },
  { name: "Chemistry", icon: "🧪", color: "#f1eaff", accent: "#7c3aed" },
  { name: "Mathematics", icon: "📐", color: "#e1f8ee", accent: "#10b981" },
  { name: "Biology", icon: "🧬", color: "#fff0df", accent: "#f59e0b" },
];

// Complete Step-by-Step Roadmaps for each chapter across Class 11 & 12
const chapterRoadmapData = {
  Physics: {
    "11": [
      {
        chapter: "Units and Measurements",
        duration: "2 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Theory Base", desc: "Master 7 SI base units, supplementary units & dimensions of all physical quantities." },
          { title: "Step 2: Formula & Derivation", desc: "Practice checking equation validity and deriving relations using Dimensional Analysis." },
          { title: "Step 3: Numerical Drill", desc: "Solve absolute, relative & percentage error numericals + Vernier/Screw Gauge zero error." },
          { title: "Step 4: Test & PYQs", desc: "Solve last 5 years JEE/NEET questions + 20 AI MCQs on Error Analysis." },
        ],
      },
      {
        chapter: "Motion in a Straight Line",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Graph Interpretation", desc: "Learn slope of s-t graph = velocity, slope of v-t = acceleration, area under v-t = displacement." },
          { title: "Step 2: Calculus Formulation", desc: "Practice differential & integral equations of motion (v = dx/dt, a = v dv/dx)." },
          { title: "Step 3: Motion under Gravity", desc: "Solve vertical projectile, ball dropped from balloon & multi-body relative motion in 1D." },
          { title: "Step 4: PYQs & Time Bound Practice", desc: "Attempt 20 timed PYQs focusing on stopping distance & relative velocity." },
        ],
      },
      {
        chapter: "Motion in a Plane (Vectors & Projectile)",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Vector Algebra", desc: "Master dot product, cross product, triangle law, unit vectors & component resolution." },
          { title: "Step 2: Ground Projectile", desc: "Derive Time of Flight (2u sinθ/g), Max Height & Range (u² sin2θ/g) with trajectory equation." },
          { title: "Step 3: Advanced Trajectory", desc: "Practice horizontal projectile from tower, projectile on inclined plane & river-boat problems." },
          { title: "Step 4: Mock & AI Practice", desc: "Attempt 20 AI MCQs on projectile at angle + uniform circular acceleration." },
        ],
      },
      {
        chapter: "Laws of Motion & Friction",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Free Body Diagrams (FBD)", desc: "Draw clear isolated body diagrams for tension, normal reaction and inclined planes." },
          { title: "Step 2: Newton's 2nd & 3rd Laws", desc: "Solve pulley systems, connected bodies, lift problems and pseudo force in non-inertial frames." },
          { title: "Step 3: Static & Kinetic Friction", desc: "Solve two-block problems, angle of repose, banking of roads with & without friction." },
          { title: "Step 4: Mixed Drill", desc: "Practice 20 standard JEE/NEET level friction and equilibrium problems." },
        ],
      },
      {
        chapter: "Work, Energy and Power",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Work-Energy Theorem", desc: "Work done by constant & variable force; Work done by all forces = Change in Kinetic Energy." },
          { title: "Step 2: Potential Energy & Conservation", desc: "Gravitational & spring potential energy; mechanical energy conservation principle." },
          { title: "Step 3: Power & Vertical Circle", desc: "Instantaneous vs average power; critical velocity at bottom (√5gR) and top (√gR) of vertical circle." },
          { title: "Step 4: 1D & 2D Collisions", desc: "Elastic & inelastic collisions, coefficient of restitution (e) and energy loss formulas." },
        ],
      },
      {
        chapter: "System of Particles & Rotational Motion",
        duration: "5 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Center of Mass (COM)", desc: "COM for discrete & continuous mass distributions (rod, semicircle disc, hemisphere)." },
          { title: "Step 2: Torque & Angular Momentum", desc: "Torque τ = r × F = Iα; Angular momentum conservation L = Iω." },
          { title: "Step 3: Moment of Inertia (MOI)", desc: "Parallel & perpendicular axis theorems; MOI of ring, disc, solid & hollow sphere, rod." },
          { title: "Step 4: Pure Rolling Motion", desc: "Condition v = Rω, acceleration on incline a = g sinθ / (1 + k²/R²)." },
        ],
      },
      {
        chapter: "Gravitation",
        duration: "2 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Newton's Law & Kepler's Laws", desc: "Inverse square law, Kepler's 3 laws (T² ∝ R³), areal velocity conservation." },
          { title: "Step 2: Acceleration due to Gravity (g)", desc: "Variation of g with altitude, depth & rotation + potential V = -GM/r." },
          { title: "Step 3: Orbital & Escape Velocity", desc: "Escape speed ve = √(2gR) ≈ 11.2 km/s; orbital velocity vo = √(gR); geostationary satellites." },
          { title: "Step 4: Energy & PYQ Solving", desc: "Total satellite energy E = -GMm/2r; binding energy." },
        ],
      },
      {
        chapter: "Mechanical Properties of Solids",
        duration: "2 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Stress-Strain Curve", desc: "Hooke's law, elastic limit, yield point, breaking stress & Young's modulus Y = (F/A)/(ΔL/L)." },
          { title: "Step 2: Bulk & Shear Modulus", desc: "Bulk modulus B = -V(ΔP/ΔV), Shear modulus η, Poisson's ratio σ (-1 to 0.5)." },
          { title: "Step 3: Elastic Potential Energy", desc: "Energy stored in stretched wire U = 1/2 × Stress × Strain × Volume." },
          { title: "Step 4: Numerical Workshop", desc: "Elongation under self-weight (ρgL²/2Y) and composite wire thermal stress." },
        ],
      },
      {
        chapter: "Mechanical Properties of Fluids",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Hydrostatics & Pascal's Law", desc: "Pressure P = P₀ + ρgh, hydraulic lift, Archimedes' buoyant force principle." },
          { title: "Step 2: Fluid Dynamics", desc: "Equation of continuity (A₁v₁ = A₂v₂) & Bernoulli's theorem (P + 1/2ρv² + ρgh = const)." },
          { title: "Step 3: Viscosity & Terminal Velocity", desc: "Newton's viscous law, Poiseuille's formula, Stokes' law F = 6πηrv & terminal velocity vt." },
          { title: "Step 4: Surface Tension & Capillarity", desc: "Surface energy, excess pressure in drop (2T/R) and bubble (4T/R), capillary rise h = 2T cosθ / (ρgr)." },
        ],
      },
      {
        chapter: "Thermal Properties of Matter",
        duration: "2 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Thermal Expansion", desc: "Linear (α), superficial (β), and volumetric (γ) expansion: α : β : γ = 1 : 2 : 3." },
          { title: "Step 2: Calorimetry", desc: "Specific heat capacity Q = mcΔT, latent heat of fusion & vaporization, water equivalent." },
          { title: "Step 3: Heat Transfer Modes", desc: "Conduction (Fourier law dQ/dt = -kA dT/dx), series-parallel rods thermal resistance." },
          { title: "Step 4: Radiation Laws", desc: "Wien's displacement law (λm T = b), Stefan-Boltzmann law (E = eσT⁴), Newton's cooling law." },
        ],
      },
      {
        chapter: "Thermodynamics",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Zeroth & First Law", desc: "Internal energy U, Heat Q, Work W (∫P dV), 1st law ΔQ = ΔU + ΔW." },
          { title: "Step 2: Thermodynamic Processes", desc: "Isothermal (PV=C, W=nRT ln(V₂/V₁)), Adiabatic (PV^γ=C, W=(P₁V₁-P₂V₂)/(γ-1)), Isobaric & Isochoric." },
          { title: "Step 3: Heat Engines & Carnot Cycle", desc: "Carnot efficiency η = 1 - T_cold/T_hot, coefficient of performance of refrigerator." },
          { title: "Step 4: Second Law & Entropy", desc: "Kelvin-Planck & Clausius statements, reversible vs irreversible processes." },
        ],
      },
      {
        chapter: "Kinetic Theory of Gases",
        duration: "2 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Ideal Gas Equation & Assumptions", desc: "PV = nRT = N k_B T, microscopic model of pressure P = 1/3 ρ v_rms²." },
          { title: "Step 2: Molecular Speeds", desc: "Root mean square v_rms = √(3RT/M), average speed v_avg = √(8RT/πM), most probable speed v_mp = √(2RT/M)." },
          { title: "Step 3: Law of Equipartition of Energy", desc: "Degrees of freedom f for monoatomic (3), diatomic (5) & polyatomic (6); energy per molecule = 1/2 f k_B T." },
          { title: "Step 4: Specific Heats Ratio (γ) & Mean Free Path", desc: "Cv = f/2 R, Cp = (f/2 + 1)R, γ = Cp/Cv; mean free path λ = 1 / (√2 π d² n)." },
        ],
      },
      {
        chapter: "Oscillations (SHM)",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Kinematics of SHM", desc: "Displacement x = A sin(ωt + φ), velocity v = ω√(A² - x²), acceleration a = -ω²x." },
          { title: "Step 2: Energy in SHM", desc: "Kinetic energy = 1/2 mω²(A² - x²), Potential energy = 1/2 mω²x², Total energy = 1/2 mω²A² (constant)." },
          { title: "Step 3: Spring-Mass & Simple Pendulum", desc: "Time period of spring-mass T = 2π√(m/k) (series/parallel springs); simple pendulum T = 2π√(L/g)." },
          { title: "Step 4: Damped & Forced Oscillations", desc: "Damping factor, quality factor, resonance condition (driving frequency = natural frequency)." },
        ],
      },
      {
        chapter: "Waves",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Progressive Wave Equation", desc: "Wave equation y = A sin(kx - ωt + φ), wave speed v = ω/k = fλ, particle velocity vs wave speed." },
          { title: "Step 2: Speed of Sound", desc: "Newton-Laplace formula v = √(γP/ρ), factors affecting sound velocity (T, humidity, pressure)." },
          { title: "Step 3: Standing Waves in Strings & Pipes", desc: "Organ pipes: Closed pipe (odd harmonics f = (2n-1)v/4L), Open pipe (all harmonics f = nv/2L)." },
          { title: "Step 4: Beats & Doppler Effect", desc: "Beat frequency f_beat = |f₁ - f₂|; Doppler frequency shift formula for moving source & observer." },
        ],
      },
    ],
    "12": [
      {
        chapter: "Electric Charges and Fields",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Coulomb's Law & Superposition", desc: "Electrostatic force F = k q₁q₂ / r², permittivity of free space ε₀, vector form of Coulomb's law." },
          { title: "Step 2: Electric Field & Dipole", desc: "Field on axial line (2kp/r³) and equatorial line (kp/r³); torque on dipole τ = p × E; potential energy U = -p·E." },
          { title: "Step 3: Gauss's Law", desc: "Flux Φ = ∮ E·dA = q_in / ε₀; applications: infinite wire (λ/2πε₀r), infinite sheet (σ/2ε₀), spherical shell." },
          { title: "Step 4: Conductors & Field Lines", desc: "Properties of electric field lines, shielding, electrostatic equilibrium inside a conductor." },
        ],
      },
      {
        chapter: "Electrostatic Potential & Capacitance",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Electric Potential & Potential Energy", desc: "V = kq/r, relation E = -dV/dr, equipotential surfaces, system of point charges energy U = kq₁q₂/r." },
          { title: "Step 2: Capacitance & Parallel Plate Capacitor", desc: "C = ε₀A / d; effect of dielectric slab of thickness t (C = ε₀A / (d - t + t/K)); induced charge." },
          { title: "Step 3: Combination & Energy Stored", desc: "Series (1/C = 1/C₁ + 1/C₂) & parallel combinations; energy U = 1/2 CV² = Q²/2C; energy density 1/2 ε₀E²." },
          { title: "Step 4: Redistribution of Charges", desc: "Common potential V_c = (C₁V₁ + C₂V₂) / (C₁ + C₂); heat loss formula ΔH = 1/2 C₁C₂/(C₁+C₂) (V₁ - V₂)²." },
        ],
      },
      {
        chapter: "Current Electricity",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Ohm's Law & Drift Velocity", desc: "I = n e A v_d, drift velocity v_d = eEτ/m, resistivity ρ = m / (n e² τ), temperature dependence ρ = ρ₀(1+αΔT)." },
          { title: "Step 2: Kirchhoff's Laws & Circuits", desc: "Kirchhoff's Current Law (junction) & Voltage Law (loop); star-delta & symmetry reduction techniques." },
          { title: "Step 3: EMF, Internal Resistance & Cells", desc: "Terminal voltage V = E - Ir, series and parallel combination of identical & non-identical cells." },
          { title: "Step 4: Wheatstone Bridge & Instruments", desc: "Balanced condition P/Q = R/S; Meter bridge resistance measurement; Potentiometer comparison." },
        ],
      },
      {
        chapter: "Moving Charges and Magnetism",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Lorentz Force & Motion in Fields", desc: "F = q(E + v × B); helical path with radius r = mv / (qB) and pitch p = v_parallel × T." },
          { title: "Step 2: Biot-Savart Law", desc: "dB = (μ₀/4π) (I dl × r / r³); field of circular loop at center (μ₀I/2R) and axis (μ₀IR² / 2(R²+x²)^(3/2))." },
          { title: "Step 3: Ampere's Circuital Law", desc: "∮ B·dl = μ₀ I_enclosed; magnetic field of long wire, solenoid (B = μ₀ n I) and toroid." },
          { title: "Step 4: Moving Coil Galvanometer", desc: "Torque on loop τ = M × B = NIAB sinθ; galvanometer conversion to ammeter (shunt S) and voltmeter (high R)." },
        ],
      },
      {
        chapter: "Optics (Ray & Wave)",
        duration: "5 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Refraction & Total Internal Reflection (TIR)", desc: "Snell's law, critical angle sin C = 1/μ, optical fibers, prism deviation δ = (μ - 1)A." },
          { title: "Step 2: Lens Maker's Formula & Optical Instruments", desc: "1/f = (μ - 1)(1/R₁ - 1/R₂); compound microscope and astronomical telescope magnification." },
          { title: "Step 3: Wave Optics & Huygens Principle", desc: "Wavefronts, reflection & refraction proof using wave theory, Doppler effect in light." },
          { title: "Step 4: Interference & YDSE", desc: "Fringe width β = λD/d, conditions for constructive & destructive interference, shift due to mica slab." },
        ],
      },
      {
        chapter: "Modern Physics (Dual Nature, Atoms, Nuclei)",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Photoelectric Effect", desc: "Einstein's equation hν = Φ₀ + KE_max = e V₀; graphs of stopping potential vs frequency and intensity." },
          { title: "Step 2: De Broglie Wavelength", desc: "Matter wave λ = h/p = h / √(2mE) = 12.27 / √V Å for electron." },
          { title: "Step 3: Bohr Model of Hydrogen", desc: "Radius r_n = 0.529 n²/Z Å; energy E_n = -13.6 Z²/n² eV; Rydberg formula for spectral series (Lyman, Balmer)." },
          { title: "Step 4: Nuclear Physics & Radioactivity", desc: "Mass defect Δm, binding energy per nucleon curve, nuclear fission & fusion, Q-value calculation." },
        ],
      },
    ],
  },
  Chemistry: {
    "11": [
      {
        chapter: "Some Basic Concepts of Chemistry (Mole Concept)",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Mole & Molar Mass", desc: "Mole conversions: n = mass/molar mass = N/N_A = Volume at STP / 22.4 L." },
          { title: "Step 2: Stoichiometry & Limiting Reagent", desc: "Balanced chemical equations, identify limiting reagent, theoretical vs actual percentage yield." },
          { title: "Step 3: Concentration Terms", desc: "Molarity (M), Molality (m), Mole Fraction (χ), % w/w, % w/v, PPM, and dilution formulas." },
          { title: "Step 4: Empirical Formula & PYQs", desc: "Find empirical and molecular formula from elemental percentage analysis." },
        ],
      },
      {
        chapter: "Structure of Atom",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Bohr's Atomic Model", desc: "Postulates, radius rn = 0.529 n²/Z Å, energy En = -13.6 Z²/n² eV, Rydberg formula for H-spectrum." },
          { title: "Step 2: Quantum Mechanical Model", desc: "De Broglie λ = h/mv, Heisenberg uncertainty Δx · Δp ≥ h/4π, 4 quantum numbers (n, l, m, s)." },
          { title: "Step 3: Electronic Configuration Rules", desc: "Aufbau principle, Pauli's exclusion principle, Hund's rule of maximum multiplicity; Cr & Cu exceptions." },
          { title: "Step 4: Radial & Angular Nodes", desc: "Radial nodes = n - l - 1, angular nodes = l, total nodes = n - 1; shapes of s, p, d orbitals." },
        ],
      },
      {
        chapter: "Classification of Elements & Periodicity",
        duration: "2 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Modern Periodic Law & Trends", desc: "Effective nuclear charge (Z_eff) and shielding effect (Slater's rules)." },
          { title: "Step 2: Atomic & Ionic Radii", desc: "Covalent, van der Waals & metallic radii; isoelectronic species radius order." },
          { title: "Step 3: Ionization Enthalpy & Electron Gain Enthalpy", desc: "IE₁ < IE₂ < IE₃, anomalous IE of B vs Be and O vs N; electron gain enthalpy of Cl vs F." },
          { title: "Step 4: Electronegativity & Acid-Base Nature", desc: "Pauling scale, diagonal relationships, acidic nature of non-metal oxides across period." },
        ],
      },
      {
        chapter: "Chemical Bonding & Molecular Structure",
        duration: "5 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Lewis Structures & Formal Charge", desc: "Octet rule limitations, formal charge calculation, resonance structures." },
          { title: "Step 2: VSEPR Theory", desc: "Predict shapes: linear, trigonal planar, tetrahedral, trigonal bipyramidal, octahedral; lone pair effect." },
          { title: "Step 3: Hybridization & Dipole Moment", desc: "sp, sp², sp³, sp³d, sp³d² hybridization; dipole moment μ = q × d and molecular polarity." },
          { title: "Step 4: Molecular Orbital Theory (MOT)", desc: "Bond order = 1/2 (Nb - Na), magnetic nature of O₂, B₂, C₂, N₂; intermolecular Hydrogen bonding." },
        ],
      },
      {
        chapter: "Chemical Thermodynamics",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: First Law & State Functions", desc: "Internal energy U, Enthalpy H = U + PV, work w = -P_ext ΔV, heat capacity Cp - Cv = R." },
          { title: "Step 2: Thermochemistry & Hess's Law", desc: "Enthalpy of formation, combustion, neutralization, bond dissociation enthalpy." },
          { title: "Step 3: Second Law & Entropy (S)", desc: "Entropy change ΔS = q_rev / T, spontaneity criteria ΔS_universe > 0." },
          { title: "Step 4: Gibbs Free Energy (G)", desc: "Gibbs equation ΔG = ΔH - TΔS, standard free energy ΔG° = -RT ln K_eq." },
        ],
      },
    ],
    "12": [
      {
        chapter: "Solutions",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Raoult's Law & Vapor Pressure", desc: "Ideal vs non-ideal solutions, positive & negative deviations, azeotropes." },
          { title: "Step 2: Colligative Properties", desc: "Relative lowering of VP (ΔP/P₀ = χ_solute), elevation in BP (ΔTb = Kb·m), depression in FP (ΔTf = Kf·m)." },
          { title: "Step 3: Osmotic Pressure & Reverse Osmosis", desc: "π = CRT, isotonic/hypotonic/hypertonic solutions, desalination." },
          { title: "Step 4: Van't Hoff Factor (i)", desc: "Degree of dissociation α = (i - 1)/(n - 1) & association α = (1 - i)/(1 - 1/n)." },
        ],
      },
      {
        chapter: "Electrochemistry",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Galvanic Cells & Nernst Equation", desc: "Standard electrode potentials, E_cell = E°_cell - (0.0591/n) log Q at 298 K." },
          { title: "Step 2: Conductance & Kohlrausch's Law", desc: "Molar conductivity Λm, equivalent conductivity, limiting molar conductivity Λ°m." },
          { title: "Step 3: Electrolysis & Faraday's Laws", desc: "w = ZIt, products of electrolysis of molten & aqueous salts." },
          { title: "Step 4: Batteries & Fuel Cells", desc: "Lead storage battery, primary dry cell, hydrogen-oxygen fuel cell, corrosion mechanism." },
        ],
      },
      {
        chapter: "Chemical Kinetics",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Rate of Reaction & Rate Law", desc: "Average vs instantaneous rate, order vs molecularity, units of rate constant k." },
          { title: "Step 2: Zero & First Order Integrated Laws", desc: "Zero order [A] = [A]₀ - kt; 1st order k = (2.303/t) log([A]₀/[A]), half-life t_1/2 = 0.693/k." },
          { title: "Step 3: Temperature Dependence & Arrhenius Equation", desc: "k = A e^(-Ea/RT), log(k₂/k₁) = (Ea / 2.303R) (1/T₁ - 1/T₂), activation energy." },
          { title: "Step 4: Collision Theory & Catalysis", desc: "Steric factor, orientation factor, role of catalyst in lowering activation energy." },
        ],
      },
      {
        chapter: "Coordination Compounds",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Werner's Theory & IUPAC Nomenclature", desc: "Primary (ionizable) vs secondary (non-ionizable) valency; systematic naming rules." },
          { title: "Step 2: Isomerism in Coordination Complexes", desc: "Structural (ionization, hydrate, linkage, coordination) & stereoisomerism (geometrical & optical)." },
          { title: "Step 3: Valence Bond Theory (VBT)", desc: "Inner orbital (d²sp³) vs outer orbital (sp³d²) complexes, magnetic moment μ = √(n(n+2)) BM." },
          { title: "Step 4: Crystal Field Theory (CFT)", desc: "Octahedral splitting (t₂g & eg, Δ₀), tetrahedral splitting (Δt = 4/9 Δ₀), spectrochemical series." },
        ],
      },
    ],
  },
  Mathematics: {
    "11": [
      {
        chapter: "Sets, Relations and Functions",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Set Operations & Venn Diagrams", desc: "Union, intersection, difference, complement, De Morgan's laws, power set cardinality 2^n." },
          { title: "Step 2: Relations & Types", desc: "Cartesian product A × B, domain, range, reflexive, symmetric, transitive & equivalence relations." },
          { title: "Step 3: Functions & Mapping", desc: "One-one (injective), onto (surjective), bijective functions; composition of functions (fog, gof)." },
          { title: "Step 4: Domain & Range Drills", desc: "Algebraic, fractional, square root, logarithmic & trigonometric domains and ranges." },
        ],
      },
      {
        chapter: "Trigonometric Functions & Equations",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Compound Angles & Transformation", desc: "sin(A±B), cos(A±B), tan(A±B), 2sinA cosB, sum-to-product and product-to-sum identities." },
          { title: "Step 2: Multiple & Submultiple Angles", desc: "sin2A = 2sinA cosA, cos2A = 1 - 2sin²A = 2cos²A - 1, tan2A, half-angle formulas." },
          { title: "Step 3: Maxima & Minima of Trigonometric Expressions", desc: "Range of a sin x + b cos x is [-√(a²+b²), +√(a²+b²)]; conditional identities in triangle." },
          { title: "Step 4: Trigonometric Equations", desc: "General solutions: sin θ = sin α => θ = nπ + (-1)^n α; cos θ = cos α => θ = 2nπ ± α." },
        ],
      },
      {
        chapter: "Complex Numbers & Quadratic Equations",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Complex Number Algebra", desc: "Modulus |z| = √(x²+y²), argument arg(z), polar form r(cosθ + i sinθ), Euler's formula r e^(iθ)." },
          { title: "Step 2: Cube Roots of Unity & De Moivre's Theorem", desc: "1 + ω + ω² = 0, ω³ = 1; properties of conjugate and modulus inequalities." },
          { title: "Step 3: Roots of Quadratic Equation", desc: "Discriminant D = b² - 4ac, nature of roots, sum α+β = -b/a, product αβ = c/a." },
          { title: "Step 4: Location of Roots & Common Roots", desc: "Conditions for roots lying in intervals (k₁, k₂), condition for one or both common roots." },
        ],
      },
      {
        chapter: "Permutations and Combinations",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Fundamental Counting Principles", desc: "Multiplication principle (AND) vs addition principle (OR), factorial properties." },
          { title: "Step 2: Permutations nPr", desc: "Arrangement with repetitions, circular permutations (n-1)!, gap and block methods." },
          { title: "Step 3: Combinations nCr", desc: "Selection problems, nCr = nC(n-r), Pascal's identity nCr + nC(r-1) = (n+1)Cr." },
          { title: "Step 4: Division into Groups & Derangements", desc: "Distributing identical & distinct objects, derangements formula D_n = n! Σ (-1)^k / k!." },
        ],
      },
    ],
    "12": [
      {
        chapter: "Matrices and Determinants",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Matrix Operations", desc: "Matrix multiplication, transpose properties (AB)^T = B^T A^T, symmetric & skew-symmetric matrices." },
          { title: "Step 2: Determinants & Properties", desc: "Expansion, row/column operations, det(AB) = det(A) det(B), det(kA) = k^n det(A)." },
          { title: "Step 3: Adjoint & Inverse of Matrix", desc: "A · adj(A) = |A| I, A⁻¹ = adj(A) / |A|, det(adj A) = |A|^(n-1)." },
          { title: "Step 4: System of Linear Equations", desc: "Cramer's rule, matrix method X = A⁻¹B, consistency & conditions for unique/infinite/no solutions." },
        ],
      },
      {
        chapter: "Continuity, Differentiability & Derivatives",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Limits & Continuity", desc: "Standard limits (lim sin x / x = 1), L'Hopital's rule for 0/0 and ∞/∞, test of continuity." },
          { title: "Step 2: Differentiability Test", desc: "Left hand derivative (LHD) vs Right hand derivative (RHD); continuity is necessary but not sufficient." },
          { title: "Step 3: Differentiation Techniques", desc: "Chain rule, implicit differentiation, logarithmic differentiation, parametric differentiation." },
          { title: "Step 4: Mean Value Theorems", desc: "Rolle's Theorem & Lagrange's Mean Value Theorem (LMVT) geometric interpretations & proofs." },
        ],
      },
      {
        chapter: "Applications of Derivatives (AOD)",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Rate Measure & Errors", desc: "dy/dt = (dy/dx)(dx/dt), percentage error calculations using differentials." },
          { title: "Step 2: Tangents & Normals", desc: "Slope of tangent m = dy/dx, slope of normal -1/m, angle of intersection of two curves." },
          { title: "Step 3: Monotonicity (Increasing / Decreasing)", desc: "f'(x) > 0 strictly increasing, f'(x) < 0 strictly decreasing; intervals of monotonicity." },
          { title: "Step 4: Maxima and Minima", desc: "First & second derivative tests, points of inflection, word problems on optimization." },
        ],
      },
      {
        chapter: "Integrals (Definite & Indefinite)",
        duration: "5 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Standard Indefinite Forms", desc: "Substitution method, integration by parts (ILATE rule), partial fractions." },
          { title: "Step 2: Special Integrals", desc: "Forms ∫ dx/(x²±a²), ∫ dx/√(a²-x²), trigonometric substitutions (tan, sec, sin)." },
          { title: "Step 3: Definite Integral Properties", desc: "King's property ∫₀^a f(x)dx = ∫₀^a f(a-x)dx, even/odd function properties, periodic integral." },
          { title: "Step 4: Leibniz Rule & Limit as Sum", desc: "Differentiating under integral sign (Leibniz formula), converting limit of Riemann sum to integral." },
        ],
      },
    ],
  },
  Biology: {
    "11": [
      {
        chapter: "The Living World & Biological Classification",
        duration: "2 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Taxonomic Hierarchy & Binomial Nomenclature", desc: "Carolus Linnaeus rules, Domain down to Species, Herbarium & Botanical Gardens." },
          { title: "Step 2: Five Kingdom System", desc: "Whittaker's 5 kingdoms: Monera (bacteria, archaebacteria), Protista (protozoa, diatoms), Fungi, Plantae, Animalia." },
          { title: "Step 3: Kingdom Fungi & Viruses", desc: "Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes; structure of viruses, viroids & prions." },
          { title: "Step 4: High Yield NCERT Summary", desc: "Solve 20 high-yield questions on kingdom classification differences." },
        ],
      },
      {
        chapter: "Cell: The Unit of Life",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Prokaryotic vs Eukaryotic Cell", desc: "Bacterial cell envelope, mesosomes, plasmids; Fluid mosaic model of plasma membrane (Singer & Nicolson)." },
          { title: "Step 2: Endomembrane System", desc: "Endoplasmic reticulum (RER & SER), Golgi apparatus, Lysosomes & Vacuoles coordinated functions." },
          { title: "Step 3: Semi-Autonomous Organelles", desc: "Mitochondria (cristae, 70S ribosomes) and Chloroplasts (thylakoids, stroma lamellae); Endosymbiotic theory." },
          { title: "Step 4: Nucleus & Chromosomes", desc: "Nuclear pore complex, nucleolus, chromatin structure, centromere positions (metacentric, telocentric)." },
        ],
      },
      {
        chapter: "Cell Cycle and Cell Division",
        duration: "2 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Interphase Stages", desc: "G1 phase (cell growth), S phase (DNA replication, centriole duplication), G2 phase (protein synthesis), G0 resting." },
          { title: "Step 2: Mitosis Phases", desc: "Prophase, Metaphase (chromosomes align at equator), Anaphase (sister chromatids separate), Telophase & Cytokinesis." },
          { title: "Step 3: Meiosis I (Reductional Division)", desc: "Prophase I substages: Leptotene, Zygotene (synapsis, synaptonemal complex), Pachytene (crossing over via recombinase), Diplotene (chiasmata), Diakinesis." },
          { title: "Step 4: Meiosis II & Significance", desc: "Equational separation, production of 4 genetically distinct haploid gametes." },
        ],
      },
      {
        chapter: "Photosynthesis in Higher Plants",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Pigments & Light Reactions", desc: "Absorption vs action spectrum, Photosystem I (P700) & PS II (P680), photolysis of water (Z-scheme)." },
          { title: "Step 2: Cyclic vs Non-Cyclic Photophosphorylation", desc: "Non-cyclic generates ATP + NADPH; cyclic generates only ATP; chemiosmotic hypothesis (proton gradient across thylakoid)." },
          { title: "Step 3: Dark Reaction (Calvin Cycle / C3)", desc: "Carboxylation via RuBisCO (most abundant enzyme on Earth), reduction (glucose synthesis), regeneration of RuBP." },
          { title: "Step 4: C4 Pathway & Photorespiration", desc: "Kranz anatomy in maize/sugarcane, PEP carboxylase, absence of photorespiration in C4 plants." },
        ],
      },
    ],
    "12": [
      {
        chapter: "Sexual Reproduction in Flowering Plants",
        duration: "3 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Microsporogenesis & Pollen Grain", desc: "Anther wall layers (epidermis, endothecium, middle layers, tapetum); pollen grain exine (sporopollenin) & intine." },
          { title: "Step 2: Megasporogenesis & Embryo Sac", desc: "Monosporic development, 7-celled 8-nucleate female gametophyte (egg apparatus, central cell with 2 polar nuclei, antipodals)." },
          { title: "Step 3: Pollination & Outbreeding Devices", desc: "Autogamy, geitonogamy, xenogamy; adaptations for wind, water & insect pollination; self-incompatibility." },
          { title: "Step 4: Double Fertilization & Seed Development", desc: "Syngamy (zygote 2n) + Triple fusion (PEN 3n); endosperm development before embryo; apomixis & polyembryony." },
        ],
      },
      {
        chapter: "Principles of Inheritance and Variation (Genetics)",
        duration: "4 Days • 20 MCQs",
        steps: [
          { title: "Step 1: Mendel's Monohybrid & Dihybrid Crosses", desc: "Law of Dominance, Law of Segregation (pure gametes), Law of Independent Assortment (9:3:3:1 ratio)." },
          { title: "Step 2: Non-Mendelian Inheritance", desc: "Incomplete dominance (Snapdragon 1:2:1), Co-dominance & Multiple alleles (ABO blood grouping in humans)." },
          { title: "Step 3: Chromosomal Theory & Linkage", desc: "Sutton & Boveri; Morgan's Drosophila experiments; linkage vs recombination frequency (genetic mapping by Sturtevant)." },
          { title: "Step 4: Genetic Disorders", desc: "Mendelian (Hemophilia, Sickle cell anemia, Phenylketonuria, Thalassemia) & Chromosomal (Down's 21-trisomy, Turner's XO, Klinefelter's XXY)." },
        ],
      },
    ],
  },
};

// ================= CHAPTER-SPECIFIC 20 QUESTIONS =================
const electricChargesAndFields20 = [
  {
    _id: "ecf_1",
    question: "According to Coulomb's Law, the electrostatic force between two point charges q₁ and q₂ separated by distance r in vacuum is given by:",
    options: ["F = (1/4πε₀) · (q₁q₂ / r)", "F = (1/4πε₀) · (q₁q₂ / r²)", "F = (4πε₀) · (q₁q₂ / r²)", "F = (1/4πε₀) · (q₁q₂ / r³)"],
    answer: "F = (1/4πε₀) · (q₁q₂ / r²)",
    difficulty: "Easy",
    examTag: "Coulomb's Law",
    explanation: "Coulomb's inverse-square law states that electrostatic force between stationary point charges is F = (1/4πε₀)(q₁q₂/r²).",
  },
  {
    _id: "ecf_2",
    question: "The SI unit of permittivity of free space (ε₀) is:",
    options: ["C² N⁻¹ m⁻²", "N m² C⁻²", "C N⁻¹ m⁻¹", "N C⁻¹ m²"],
    answer: "C² N⁻¹ m⁻²",
    difficulty: "Easy",
    examTag: "Units & Dimensions",
    explanation: "ε₀ = q₁q₂ / (4π F r²), giving units C² N⁻¹ m⁻² (or Farad per meter, F/m).",
  },
  {
    _id: "ecf_3",
    question: "The electric field intensity E at distance r from a point charge q in vacuum is proportional to:",
    options: ["r", "1 / r", "1 / r²", "1 / r³"],
    answer: "1 / r²",
    difficulty: "Easy",
    examTag: "Electric Field",
    explanation: "By definition, E = F / q₀ = (1/4πε₀) · (q / r²), which follows an inverse-square law (E ∝ 1/r²).",
  },
  {
    _id: "ecf_4",
    question: "An electric dipole of moment p is placed in a uniform electric field E. The torque τ acting on the dipole is:",
    options: ["p · E", "p × E", "E × p", "Zero"],
    answer: "p × E",
    difficulty: "Easy",
    examTag: "Electric Dipole",
    explanation: "The two equal and opposite forces form a couple producing torque τ = p × E with magnitude pE sin θ.",
  },
  {
    _id: "ecf_5",
    question: "The potential energy U of an electric dipole of moment p in a uniform electric field E is given by:",
    options: ["-p · E", "+p · E", "p × E", "-pE sin θ"],
    answer: "-p · E",
    difficulty: "Easy",
    examTag: "Dipole Potential Energy",
    explanation: "U = -∫ τ dθ = -pE cos θ = -p · E. The dipole is in stable equilibrium when aligned with field (θ = 0°, U = -pE).",
  },
  {
    _id: "ecf_6",
    question: "The electric field intensity on the axial line of a short electric dipole of dipole moment p at distance r from center is:",
    options: ["(1/4πε₀) · (p / r³)", "(1/4πε₀) · (2p / r³)", "(1/4πε₀) · (2p / r²)", "(1/4πε₀) · (p / r²)"],
    answer: "(1/4πε₀) · (2p / r³)",
    difficulty: "Medium",
    examTag: "Dipole Field",
    explanation: "On the axial line of a short dipole (r >> a), E_axial = (1/4πε₀)(2p / r³), directed along the dipole axis.",
  },
  {
    _id: "ecf_7",
    question: "The ratio of electric field on the axial line to that on the equatorial line of a short dipole at the same distance r is:",
    options: ["1 : 1", "2 : 1", "1 : 2", "4 : 1"],
    answer: "2 : 1",
    difficulty: "Easy",
    examTag: "Dipole Field Comparison",
    explanation: "E_axial = 2kp/r³ and E_equatorial = kp/r³. Therefore, E_axial / E_equatorial = 2 : 1.",
  },
  {
    _id: "ecf_8",
    question: "According to Gauss's Law, the total electric flux Φ through any closed surface enclosing net charge q_in in vacuum is:",
    options: ["q_in / ε₀", "ε₀ · q_in", "q_in / (4πε₀)", "Zero always"],
    answer: "q_in / ε₀",
    difficulty: "Easy",
    examTag: "Gauss's Law",
    explanation: "Gauss's law states that the surface integral of electric field over a closed surface equals enclosed charge divided by ε₀: ∮ E · dA = q_in / ε₀.",
  },
  {
    _id: "ecf_9",
    question: "The electric field intensity at distance r from an infinitely long straight wire with uniform linear charge density λ is:",
    options: ["λ / (2πε₀r)", "λ / (4πε₀r²)", "λ / (2πε₀r²)", "2πλ / (ε₀r)"],
    answer: "λ / (2πε₀r)",
    difficulty: "Medium",
    examTag: "Gauss's Law Application",
    explanation: "Using a cylindrical Gaussian surface of radius r and length L: E · (2πrL) = λL / ε₀ => E = λ / (2πε₀r).",
  },
  {
    _id: "ecf_10",
    question: "The electric field due to a uniformly charged infinite thin plane sheet with surface charge density σ is:",
    options: ["σ / ε₀", "σ / (2ε₀)", "2σ / ε₀", "σ / (4πε₀)"],
    answer: "σ / (2ε₀)",
    difficulty: "Easy",
    examTag: "Gauss's Law Application",
    explanation: "Using a cylindrical pillbox Gaussian surface piercing the sheet: 2 E A = σ A / ε₀ => E = σ / (2ε₀).",
  },
  {
    _id: "ecf_11",
    question: "The electric field inside a hollow spherical conducting shell carrying uniform charge Q on its surface is:",
    options: ["kQ / r²", "kQ / R²", "Zero", "Infinite"],
    answer: "Zero",
    difficulty: "Easy",
    examTag: "Spherical Shell",
    explanation: "Inside the shell (r < R), no charge is enclosed (q_in = 0). Applying Gauss's Law: ∮ E · dA = 0 => E = 0 everywhere inside.",
  },
  {
    _id: "ecf_12",
    question: "When two point charges in vacuum are transferred into a dielectric medium of dielectric constant K = 4, the force between them:",
    options: ["Increases by 4 times", "Decreases by 4 times (F/4)", "Remains unchanged", "Becomes zero"],
    answer: "Decreases by 4 times (F/4)",
    difficulty: "Easy",
    examTag: "Dielectric Constant",
    explanation: "In a medium of dielectric constant K, permittivity ε = K ε₀. Hence force F' = F_vac / K = F / 4.",
  },
  {
    _id: "ecf_13",
    question: "What is the work done in rotating an electric dipole of moment p in a uniform field E from θ = 0° (stable equilibrium) to θ = 180°?",
    options: ["pE", "2pE", "-2pE", "Zero"],
    answer: "2pE",
    difficulty: "Medium",
    examTag: "Work Done on Dipole",
    explanation: "W = -pE (cos 180° - cos 0°) = -pE (-1 - 1) = +2pE.",
  },
  {
    _id: "ecf_14",
    question: "The total number of electric field lines originating from a positive charge of 1 Coulomb in vacuum is approximately:",
    options: ["1.13 × 10¹¹", "8.85 × 10⁻¹²", "9 × 10⁹", "6.25 × 10¹⁸"],
    answer: "1.13 × 10¹¹",
    difficulty: "Medium",
    examTag: "Electric Flux & Field Lines",
    explanation: "Total flux = q / ε₀ = 1 / (8.854 × 10⁻¹²) ≈ 1.13 × 10¹¹ lines of force.",
  },
  {
    _id: "ecf_15",
    question: "Which of the following statements about electrostatic field lines is INCORRECT?",
    options: [
      "Field lines start at positive charges and end at negative charges",
      "Two electric field lines can never cross each other",
      "Electrostatic field lines form continuous closed loops",
      "Tangent to a field line gives the direction of electric field at that point"
    ],
    answer: "Electrostatic field lines form continuous closed loops",
    difficulty: "Easy",
    examTag: "Field Line Properties",
    explanation: "Electrostatic fields are conservative (∮ E · dl = 0), so electrostatic field lines NEVER form closed loops.",
  },
  {
    _id: "ecf_16",
    question: "Two identical conducting spheres carry charges +3q and -q. When brought into contact and separated to the same distance, the new force is:",
    options: ["Repulsive, 1/3 of initial magnitude", "Attractive, 1/3 of initial magnitude", "Repulsive, 4/3 of initial magnitude", "Zero"],
    answer: "Repulsive, 1/3 of initial magnitude",
    difficulty: "Medium",
    examTag: "Charge Sharing",
    explanation: "Initial attractive force F ∝ 3q². On contact, total charge +2q divides equally: each gets +q. New force F' ∝ (+q)(+q) = q² (repulsive). Ratio F'/F = 1/3.",
  },
  {
    _id: "ecf_17",
    question: "An electron (mass m_e, charge -e) and a proton (mass m_p, charge +e) are released from rest in the same uniform electric field. The ratio of their accelerations (a_e / a_p) is:",
    options: ["1", "m_p / m_e", "m_e / m_p", "√(m_p / m_e)"],
    answer: "m_p / m_e",
    difficulty: "Easy",
    examTag: "Motion in Electric Field",
    explanation: "Force magnitude F = eE is identical for both. Acceleration a = F/m, hence a_e / a_p = m_p / m_e ≈ 1836.",
  },
  {
    _id: "ecf_18",
    question: "The electric field just outside the surface of a charged conductor of any arbitrary shape with surface charge density σ is:",
    options: ["σ / (2ε₀)", "σ / ε₀", "2σ / ε₀", "Zero"],
    answer: "σ / ε₀",
    difficulty: "Medium",
    examTag: "Charged Conductor",
    explanation: "Applying Gauss's Law with a small cylindrical Gaussian surface half inside (where E=0) and half outside: E · A = σ A / ε₀ => E = σ / ε₀.",
  },
  {
    _id: "ecf_19",
    question: "The SI unit of electric flux (Φ) is:",
    options: ["N m² C⁻¹ (or Volt · meter)", "N C⁻¹ m", "J C⁻¹", "Volt / meter"],
    answer: "N m² C⁻¹ (or Volt · meter)",
    difficulty: "Easy",
    examTag: "Electric Flux Units",
    explanation: "Flux Φ = E · A = (N/C) · m² = N m² C⁻¹ = (V/m) · m² = V · m (Volt-meter).",
  },
  {
    _id: "ecf_20",
    question: "A charge Q is placed at the center of an imaginary cube of side a. The electric flux passing through ONE FACE of the cube is:",
    options: ["Q / ε₀", "Q / (6ε₀)", "Q / (8ε₀)", "Q / (24ε₀)"],
    answer: "Q / (6ε₀)",
    difficulty: "Easy",
    examTag: "Symmetry in Gauss's Law",
    explanation: "Total flux through all 6 identical faces of the cube is Q / ε₀. By symmetry, the flux through one individual face is Q / (6ε₀).",
  },
];

/// Smart Chapter Question Resolver
function getChapterQuestions(subject, classLevel, chapter) {
  const norm = (chapter || "").toLowerCase();

  // 1. Electric Charges & Fields (Class 12 Physics)
  if (
    norm.includes("electric charge") ||
    norm.includes("electric field") ||
    norm.includes("electrostat") ||
    norm.includes("coulomb")
  ) {
    return electricChargesAndFields20;
  }

  // Default fallback to 20 chapter questions
  return electricChargesAndFields20;
}

// Button Style Fix
const primaryBtnStyle = {
  padding: "12px 22px",
  border: "none",
  borderRadius: "10px",
  background: "linear-gradient(115deg, #7958fa, #5739e3)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};
const default20PhysicsQuestions = electricChargesAndFields20;

const subjectQuestionBanks = {
  Physics: electricChargesAndFields20,
  Chemistry: electricChargesAndFields20,
  Mathematics: electricChargesAndFields20,
  Biology: electricChargesAndFields20,
};
export default function StudentDashboard() {
  // Overview is at the top
  const [activeTab, setActiveTab] = useState("Overview");
  const [planSubject, setPlanSubject] = useState("Physics");
  const [planClass, setPlanClass] = useState("12");
  const [completedSteps, setCompletedSteps] = useState({});

  // Dynamic Subject & 20 Practice Questions State
  const [mcqSubject, setMcqSubject] = useState("Physics");
  const [mcqClass, setMcqClass] = useState("12");
  const [mcqChapter, setMcqChapter] = useState("Electric Charges and Fields");
  const [activeSet, setActiveSet] = useState(1);
  const [mcqBankQuestions, setMcqBankQuestions] = useState(electricChargesAndFields20);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [mcqBankAnswers, setMcqBankAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

  // Dynamic Lecture Questions State (YouTube URL ke 20 AI MCQs)
  const [lectureMcqs, setLectureMcqs] = useState([]);
  const [lectureTitle, setLectureTitle] = useState("");
  const [useLectureQuestions, setUseLectureQuestions] = useState(false);

  // YouTube Analyzer state
  const [lectureUrl, setLectureUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [playEmbed, setPlayEmbed] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [mcqSubmitted, setMcqSubmitted] = useState(false);

  // User Profile
  const user = JSON.parse(
    localStorage.getItem("studylens_user") ||
    localStorage.getItem("user") ||
    "{}"
  );
  const displayName = user?.fullName || user?.name || "Student";
  const displayExam = user?.examPreference ? `${user.examPreference} Aspirant` : (user?.exam || "Aspirant");
  const avatarLetter = (displayName[0] || "S").toUpperCase();
    localStorage.getItem("studylens_user") ||
    localStorage.getItem("user") ||
    "{}"
  ;

  // Overview at top of nav items
  const navItems = [
    ["Overview", "⌂"],
    ["Study Plan", "📅"],
    ["YouTube Analyzer", "▶"],
    ["AI Notes", "✎"],
    ["Practice MCQs", "✓"],
    ["My Progress", "↗"],
  ];

  function toggleStepDone(stepKey) {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  }

  // Handle switching subjects manually in Practice MCQs
  function handleSubjectChange(newSubject) {
    setMcqSubject(newSubject);
    setUseLectureQuestions(false);
    setMcqBankAnswers({});
    setShowExplanation({});
    const list = chapterRoadmapData[newSubject]?.[mcqClass] || [];
    const firstChapter = list.length > 0 ? list[0].chapter : "";
    setMcqChapter(firstChapter);
    const qList = getChapterQuestions(newSubject, mcqClass, firstChapter);
    setMcqBankQuestions(qList);
  }

  // Handle switching class (11th or 12th)
  function handleClassChange(newClass) {
    setMcqClass(newClass);
    setUseLectureQuestions(false);
    setMcqBankAnswers({});
    setShowExplanation({});
    const list = chapterRoadmapData[mcqSubject]?.[newClass] || [];
    const firstChapter = list.length > 0 ? list[0].chapter : "";
    setMcqChapter(firstChapter);
    const qList = getChapterQuestions(mcqSubject, newClass, firstChapter);
    setMcqBankQuestions(qList);
  }

  // Handle switching chapter directly from dropdown
  function handleChapterChange(newChapter) {
    setMcqChapter(newChapter);
    setUseLectureQuestions(false);
    setMcqBankAnswers({});
    setShowExplanation({});
    const qList = getChapterQuestions(mcqSubject, mcqClass, newChapter);
    setMcqBankQuestions(qList);
  }

  // Switch to lecture questions
  function handleGoToLecturePractice() {
    if (lectureMcqs.length > 0) {
      setUseLectureQuestions(true);
      setMcqBankQuestions(lectureMcqs);
      setMcqBankAnswers({});
      setShowExplanation({});
    }
    setActiveTab("Practice MCQs");
  }

  // Reset practice bank answers
  function handleResetBank() {
    setMcqBankAnswers({});
    setShowExplanation({});
  }

  // Sync chapter dropdown when subject or class changes
  useEffect(() => {
    const list = chapterRoadmapData[mcqSubject]?.[mcqClass] || [];
    if (list.length > 0 && !list.some((c) => c.chapter === mcqChapter)) {
      setMcqChapter(list[0].chapter);
    }
  }, [mcqSubject, mcqClass]);

  // Load questions when tab or filters change
  useEffect(() => {
    if (activeTab !== "Practice MCQs") return;

    if (useLectureQuestions && lectureMcqs.length > 0) {
      setMcqBankQuestions(lectureMcqs);
      return;
    }

    const qList = getChapterQuestions(mcqSubject, mcqClass, mcqChapter);
    setMcqBankQuestions(qList);
  }, [activeTab, useLectureQuestions, mcqSubject, mcqClass, mcqChapter, lectureMcqs]);

  async function handleLectureSubmit(event) {
    event.preventDefault();
    setMessage("");

    let parsedUrl;
    try {
      parsedUrl = new URL(lectureUrl.trim());
    } catch {
      setMessage("Please enter a valid YouTube URL.");
      return;
    }

    const hosts = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
      "www.youtu.be",
    ];

    if (
      parsedUrl.protocol !== "https:" ||
      !hosts.includes(parsedUrl.hostname)
    ) {
      setMessage("Please enter a valid HTTPS YouTube URL.");
      return;
    }

    const token =
      localStorage.getItem("studylens_token") ||
      localStorage.getItem("token") ||
      "";

    setLoading(true);
    setGenerated(null);
    setPlayEmbed(false);
    setMcqAnswers({});
    setMcqSubmitted(false);

    try {
      const response = await fetch(`${API_URL}/api/lectures/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          lectureUrl: parsedUrl.toString(),
          videoUrl: parsedUrl.toString(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to submit lecture.");
      }

      setGenerated(data);
      setLectureUrl("");
      setMessage(data.message || "Lecture analyzed successfully!");

      // If backend returned 20 MCQs from the lecture notes
      if (Array.isArray(data.mcqs) && data.mcqs.length > 0) {
        const formatted = data.mcqs.map((q, idx) => ({
          ...q,
          _id: q._id || `ai_q_${idx}`,
          difficulty: q.difficulty || "Medium",
          examTag: q.examTag || "Lecture Notes AI",
        }));
        setLectureMcqs(formatted);
        setUseLectureQuestions(true);
        setMcqBankQuestions(formatted);
        setMcqBankAnswers({});
        setShowExplanation({});

        // Detect subject
        const titleText = data.message || "";
        const notesText = (data.notes || []).join(" ");
        const formulasText = (data.formulas || []).join(" ");
        const combined = `${titleText} ${notesText} ${formulasText}`.toLowerCase();

        let detected = "Physics";
        if (/physics|kinematics|motion|velocity|force|newton|gravity|projectile|friction|torque|dimension|momentum|optics|electro/i.test(combined)) {
          detected = "Physics";
        } else if (/chemistry|mole|reaction|atomic|bonding|acid|base|thermodynamics|equilibrium|organic/i.test(combined)) {
          detected = "Chemistry";
        } else if (/math|trigonometry|algebra|calculus|matrix|matrices|derivative|integral|limit|vector/i.test(combined)) {
          detected = "Mathematics";
        } else if (/biology|cell|genetics|dna|plant|animal|photosynthesis|respiration|human|organism/i.test(combined)) {
          detected = "Biology";
        }
        setMcqSubject(detected);

        const titleMatch = (data.message || "").match(/"([^"]+)"/);
        setLectureTitle(titleMatch ? titleMatch[1] : `${detected} Lecture Notes`);
      }
    } catch (error) {
      console.error("Lecture processing error:", error);
      setMessage(error.message || "Unknown error while processing lecture.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("studylens_token");
    localStorage.removeItem("studylens_user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  const activeQuestions =
    generated && generated.mcqs && generated.mcqs.length > 0
      ? generated.mcqs
      : default20PhysicsQuestions;

  const answeredCount = Object.keys(mcqAnswers).length;
  const score = activeQuestions.filter(
    (question, index) => mcqAnswers[index] === question.answer
  ).length;
  const accuracyPercent =
    mcqSubmitted && activeQuestions.length > 0
      ? Math.round((score / activeQuestions.length) * 100)
      : 0;

  const notesCount = generated ? (generated.notes || []).length : 0;
  const formulasCount = generated ? (generated.formulas || []).length : 0;

  const analyzedVideoId = generated?.videoId || "5d9EDH_yK3s";
  const analyzedTitleMatch = (generated?.message || "").match(/"([^"]+)"/);
  const analyzedTitle = analyzedTitleMatch
    ? analyzedTitleMatch[1]
    : (lectureTitle || "Physics & JEE Main Lecture");

  const currentRoadmaps = chapterRoadmapData[planSubject]?.[planClass] || [];

  // Practice bank score calculation
  const bankAttempted = Object.keys(mcqBankAnswers).length;
  const bankCorrect = mcqBankQuestions.filter(
    (q) => mcqBankAnswers[q._id] && mcqBankAnswers[q._id] === q.answer
  ).length;

  return (
    <div className="sl-dashboard">
      {/* Sidebar */}
      <aside className="sl-sidebar">
        <div className="sl-brand">
          <span className="sl-brand-icon">✦</span>
          <span>
            StudyLens <b>AI</b>
          </span>
        </div>

        <span className="sl-menu-label">MENU</span>
        <nav className="sl-nav">
          {navItems.map(([name, icon]) => (
            <button
              key={name}
              type="button"
              className={`sl-nav-item ${activeTab === name ? "active" : ""}`}
              onClick={() => setActiveTab(name)}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        {/* Sidebar Bottom: Study smarter & Logout */}
        <div className="sl-sidebar-bottom">
          <div className="sl-help-card">
            <span>💡</span>
            <b>Study smarter</b>
            <p>Paste any YouTube lecture to generate notes & AI questions.</p>
          </div>

          <button
            type="button"
            className="sl-logout"
            onClick={handleLogout}
            title="Log out of your account"
          >
            <span>⎋</span>
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="sl-main">
        {/* Topbar Header */}
        <header className="sl-topbar">
          <div>
            <h1 style={{ margin: 0, fontSize: "21px", fontWeight: 800, color: "#17213a" }}>
              {activeTab === "Overview"
                ? "Student Dashboard"
                : activeTab === "Study Plan"
                ? "Interactive Study Roadmap"
                : activeTab === "YouTube Analyzer"
                ? "YouTube Video Intelligence"
                : activeTab === "AI Notes"
                ? "AI Generated Study Notes"
                : activeTab === "Practice MCQs"
                ? "Targeted 20 Practice MCQs"
                : "Performance & Progress"}
            </h1>
            <p style={{ margin: "4px 0 0", color: "#6e7790", fontSize: "13px" }}>
              AI-driven preparation platform for JEE & NEET aspirants
            </p>
          </div>

          {/* User Profile in Header */}
          <div className="sl-profile">
  <div className="sl-avatar">
    {avatarLetter}
  </div>
  <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left" }}>
    <b style={{ display: "block", color: "#1e293b", fontSize: "13.5px", fontWeight: 800, lineHeight: 1.2 }}>
      {displayName.toUpperCase()}
    </b>
    <span style={{ display: "block", color: "#64748b", fontSize: "11.5px", fontWeight: 600, lineHeight: 1.2 }}>
      {displayExam}
    </span>
  </div>
</div>
        </header>

                {/* ================= TAB 1: OVERVIEW (CREATIVE & MODERN AI HQ) ================= */}
        {activeTab === "Overview" && (
          <section className="sl-panel" style={{ padding: "0", background: "transparent", border: "none", boxShadow: "none" }}>
            {/* 1. Hero Welcome Banner with Glowing Ambience */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 75%, #6366f1 100%)",
                borderRadius: "20px",
                padding: "32px 36px",
                color: "white",
                boxShadow: "0 14px 34px -8px rgba(67, 56, 202, 0.38)",
                position: "relative",
                overflow: "hidden",
                marginBottom: "26px",
              }}
            >
              {/* Background ambient glow circles */}
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(165, 180, 252, 0.28) 0%, rgba(99, 102, 241, 0) 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-60px",
                  right: "220px",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(192, 132, 252, 0.2) 0%, rgba(99, 102, 241, 0) 70%)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "24px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {/* Left: User Welcome & Action Pills */}
                <div style={{ maxWidth: "580px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.14)", backdropFilter: "blur(8px)", padding: "5px 12px", borderRadius: "30px", marginBottom: "14px", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                    <span style={{ fontSize: "13px" }}>⚡</span>
                    <span style={{ fontSize: "11.5px", fontWeight: 800, letterSpacing: "0.5px", textTransform: "uppercase", color: "#e0e7ff" }}>
                      AI-POWERED PREPARATION HQ • JEE & NEET 2026-27
                    </span>
                  </div>

                  <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 10px", lineHeight: 1.25, color: "#ffffff" }}>
  Welcome back, {displayName}! 🚀
</h1>
                  <p style={{ margin: "0 0 20px", color: "#c7d2fe", fontSize: "14px", lineHeight: 1.6 }}>
                    Your personalized AI study copilot is ready. Track chapter roadmaps, convert video lectures into smart notes, and practice 20 targeted MCQs daily.
                  </p>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab("YouTube Analyzer")}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#ffffff",
                        color: "#312e81",
                        fontSize: "13px",
                        fontWeight: 800,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                      }}
                    >
                      <span>▶</span> Analyze Lecture
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToLecturePractice}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "1.5px solid rgba(255, 255, 255, 0.4)",
                        background: "rgba(255, 255, 255, 0.12)",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <span>🎯</span> Practice 20 MCQs
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("Study Plan")}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "1.5px solid rgba(255, 255, 255, 0.4)",
                        background: "rgba(255, 255, 255, 0.12)",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <span>📅</span> Study Roadmaps
                    </button>
                  </div>
                </div>

                {/* Right: Study Streak & Daily Goal Card */}
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(14px)",
                    borderRadius: "16px",
                    padding: "20px 24px",
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    minWidth: "260px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#fef08a", display: "flex", alignItems: "center", gap: "5px" }}>
                      🔥 5-DAY STUDY STREAK
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(34, 197, 94, 0.25)", color: "#86efac", padding: "2px 8px", borderRadius: "10px", border: "1px solid rgba(34, 197, 94, 0.4)" }}>
                      Active
                    </span>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px", color: "#e0e7ff" }}>
                      <span>Today's Study Goal</span>
                      <b>4.5 / 6.0 Hrs (75%)</b>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "8px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: "75%",
                          height: "100%",
                          background: "linear-gradient(90deg, #38bdf8, #4ade80)",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </div>

                  {/* 7 Days of Week Dots */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.14)" }}>
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, dIdx) => (
                      <div key={dIdx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: dIdx < 5 ? "#e0e7ff" : "#94a3b8" }}>{day}</span>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: dIdx < 5 ? "#22c55e" : "rgba(255, 255, 255, 0.18)",
                            display: "grid",
                            placeItems: "center",
                            fontSize: "11px",
                            color: "white",
                            fontWeight: 800,
                          }}
                        >
                          {dIdx < 5 ? "✓" : "○"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Creative 4-Stats Metrics Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "26px",
              }}
            >
              {[
                {
                  icon: "⏱",
                  label: "Total Study Time",
                  value: "38.5 hrs",
                  tag: "+14% this week",
                  sub: "Daily Pace: 5.5 hrs",
                  color: "#3b82f6",
                  bg: "#eff6ff",
                  border: "#bfdbfe",
                },
                {
                  icon: "📝",
                  label: "AI Notes Generated",
                  value: notesCount > 0 ? notesCount + " Topics" : "18 Topics",
                  tag: "From Video Lectures",
                  sub: "100% Concept Coverage",
                  color: "#10b981",
                  bg: "#ecfdf5",
                  border: "#a7f3d0",
                },
                {
                  icon: "📐",
                  label: "Key Formula Deck",
                  value: formulasCount > 0 ? formulasCount + " Stored" : "24 Stored",
                  tag: "Formula Sheet",
                  sub: "Ready for Revision",
                  color: "#f59e0b",
                  bg: "#fffbeb",
                  border: "#fde68a",
                },
                {
                  icon: "🎯",
                  label: "Practice Accuracy",
                  value: bankAttempted > 0 ? Math.round((bankCorrect / bankAttempted) * 100) + "%" : (accuracyPercent > 0 ? accuracyPercent + "%" : "85%"),
                  tag: "Targeted 20 MCQs",
                  sub: "Mastery: Advanced 🔥",
                  color: "#8b5cf6",
                  bg: "#f5f3ff",
                  border: "#ddd6fe",
                },
              ].map((st, i) => (
                <div
                  key={i}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderTop: "4px solid " + st.color,
                    borderRadius: "14px",
                    padding: "18px 20px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "20px", padding: "8px", background: st.bg, borderRadius: "10px", border: "1px solid " + st.border }}>
                      {st.icon}
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 8px", borderRadius: "10px", background: st.bg, color: st.color }}>
                      {st.tag}
                    </span>
                  </div>
                  <small style={{ color: "#64748b", fontSize: "12px", fontWeight: 700, display: "block" }}>
                    {st.label}
                  </small>
                  <h3 style={{ margin: "4px 0 4px", fontSize: "23px", fontWeight: 800, color: "#0f172a" }}>
                    {st.value}
                  </h3>
                  <small style={{ color: "#94a3b8", fontSize: "11.5px" }}>
                    {st.sub}
                  </small>
                </div>
              ))}
            </div>

            {/* 3. Inline Quick Lecture URL Processor Bar */}
            <div
              style={{
                background: "linear-gradient(135deg, #ffffff, #fbfcfe)",
                border: "1.5px solid #e0e7ff",
                borderRadius: "16px",
                padding: "20px 24px",
                marginBottom: "26px",
                boxShadow: "0 4px 18px rgba(99, 102, 241, 0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "18px", color: "#6546ed" }}>✦</span>
                  <strong style={{ fontSize: "15px", color: "#1e1b4b" }}>Instant AI Lecture Analysis & Notes</strong>
                  <span style={{ fontSize: "11px", fontWeight: 700, background: "#ede9fe", color: "#6d28d9", padding: "2px 8px", borderRadius: "8px" }}>
                    Fast Gemini 3.0
                  </span>
                </div>
                <small style={{ color: "#64748b", fontSize: "12px" }}>
                  Paste any Physics, Chemistry, Maths or Biology lecture from YouTube
                </small>
              </div>

              <form
                onSubmit={(e) => {
                  handleLectureSubmit(e);
                  setActiveTab("AI Notes");
                }}
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="url"
                  required
                  placeholder="Paste YouTube lecture URL here (e.g. https://www.youtube.com/watch?v=...)"
                  value={lectureUrl}
                  onChange={(e) => setLectureUrl(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: "260px",
                    padding: "11px 16px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "13.5px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...primaryBtnStyle,
                    padding: "11px 22px",
                    fontSize: "13px",
                  }}
                >
                  {loading ? "Analyzing..." : "Generate Notes & 20 MCQs ⚡"}
                </button>
              </form>
            </div>

            {/* 4. Two-Column Dashboard Layout: Left (Subjects) + Right (Widgets) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
                gap: "24px",
                alignItems: "start",
              }}
            >
              {/* Left Column: 4 Subject Readiness & Roadmaps */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  padding: "22px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 2px", fontSize: "17px", color: "#17213a" }}>
                      Subject Roadmaps & Readiness
                    </h3>
                    <small style={{ color: "#64748b", fontSize: "12px" }}>
                      Direct access to Class 11 & 12 chapter roadmaps
                    </small>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("Study Plan")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6546ed",
                      fontSize: "12.5px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    View All →
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    {
                      name: "Physics",
                      icon: "⚡",
                      accent: "#3b82f6",
                      color: "#eff6ff",
                      chapters: "14 Chapters",
                      currentChapter: "Motion in a Straight Line",
                      progress: 45,
                    },
                    {
                      name: "Chemistry",
                      icon: "🧪",
                      accent: "#7c3aed",
                      color: "#f5f3ff",
                      chapters: "12 Chapters",
                      currentChapter: "Some Basic Concepts (Mole Concept)",
                      progress: 60,
                    },
                    {
                      name: "Mathematics",
                      icon: "📐",
                      accent: "#10b981",
                      color: "#ecfdf5",
                      chapters: "13 Chapters",
                      currentChapter: "Trigonometric Functions & Equations",
                      progress: 50,
                    },
                    {
                      name: "Biology",
                      icon: "🧬",
                      accent: "#f59e0b",
                      color: "#fffbeb",
                      chapters: "14 Chapters",
                      currentChapter: "Cell: The Unit of Life",
                      progress: 35,
                    },
                  ].map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "1px solid #f1f5f9",
                        background: "#fbfcfe",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "18px", padding: "6px", background: sub.color, borderRadius: "8px" }}>
                            {sub.icon}
                          </span>
                          <div>
                            <strong style={{ fontSize: "14px", color: "#1e293b" }}>{sub.name}</strong>
                            <small style={{ color: "#64748b", display: "block", fontSize: "11px" }}>
                              {sub.chapters} • Current: <b>{sub.currentChapter}</b>
                            </small>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPlanSubject(sub.name);
                            handleSubjectChange(sub.name);
                            setActiveTab("Study Plan");
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "7px",
                            border: "1px solid " + sub.accent,
                            background: "white",
                            color: sub.accent,
                            fontSize: "11.5px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Resume →
                        </button>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                          <div
                            style={{
                              width: sub.progress + "%",
                              height: "100%",
                              background: sub.accent,
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                        <small style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>
                          {sub.progress}%
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Formula Deck & Weekly Study Pace */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Widget A: Formula of the Day Flashcard */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #f8faff, #f3f6fe)",
                    border: "1.5px solid #dbeafe",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#1d4ed8", background: "#dbeafe", padding: "3px 9px", borderRadius: "8px" }}>
                      📐 FORMULA FLASHCARD
                    </span>
                    <small style={{ color: "#64748b", fontSize: "11.5px", fontWeight: 600 }}>Kinematics & Projectile</small>
                  </div>

                  <h4 style={{ margin: "0 0 10px", fontSize: "15px", color: "#1e3a8a" }}>
                    Projectile Motion Key Relations
                  </h4>

                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      border: "1px solid #bfdbfe",
                      fontFamily: "monospace",
                      fontSize: "13px",
                      color: "#1e293b",
                      lineHeight: 1.7,
                      marginBottom: "12px",
                    }}
                  >
                    <div>• <b>Time of Flight:</b> T = (2u sin θ) / g</div>
                    <div>• <b>Maximum Height:</b> H = (u² sin² θ) / (2g)</div>
                    <div>• <b>Horizontal Range:</b> R = (u² sin 2θ) / g</div>
                    <div>• <b>Max Range (θ = 45°):</b> R_max = u² / g</div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <small style={{ color: "#2563eb", fontSize: "11.5px", fontWeight: 700 }}>
                      💡 Tip: Trajectory equation is parabolic y = x tan θ - gx²/(2u²cos²θ)
                    </small>
                    <button
                      type="button"
                      onClick={() => {
                        handleSubjectChange("Physics");
                        setActiveTab("Practice MCQs");
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#2563eb",
                        color: "white",
                        fontSize: "11.5px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Test in MCQs →
                    </button>
                  </div>
                </div>

                {/* Widget B: Weekly Study Hours Bar Chart */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "20px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div>
                      <h4 style={{ margin: "0 0 2px", fontSize: "15px", color: "#17213a" }}>
                        Weekly Study Hours
                      </h4>
                      <small style={{ color: "#64748b", fontSize: "11.5px" }}>Logged 38.5 hrs this week (Goal: 42 hrs)</small>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: "6px" }}>
                      92% on Track
                    </span>
                  </div>

                  {/* Bar graph */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "110px", padding: "0 8px", borderBottom: "1px solid #e2e8f0" }}>
                    {[
                      { day: "Mon", hrs: "4.0h", h: "50%", color: "#93c5fd" },
                      { day: "Tue", hrs: "5.5h", h: "68%", color: "#93c5fd" },
                      { day: "Wed", hrs: "6.0h", h: "75%", color: "#93c5fd" },
                      { day: "Thu", hrs: "4.5h", h: "56%", color: "#93c5fd" },
                      { day: "Fri", hrs: "7.0h", h: "88%", color: "#60a5fa" },
                      { day: "Sat", hrs: "8.0h", h: "100%", color: "#6546ed", peak: true },
                      { day: "Sun", hrs: "3.5h", h: "44%", color: "#93c5fd" },
                    ].map((bar, bIdx) => (
                      <div key={bIdx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "9.5px", fontWeight: 700, color: bar.peak ? "#6546ed" : "#64748b" }}>
                          {bar.hrs}
                        </span>
                        <div
                          style={{
                            width: "22px",
                            height: bar.h,
                            background: bar.peak ? "linear-gradient(180deg, #6546ed, #4f46e5)" : bar.color,
                            borderRadius: "6px 6px 0 0",
                            boxShadow: bar.peak ? "0 4px 10px rgba(101, 70, 237, 0.3)" : "none",
                          }}
                        />
                        <span style={{ fontSize: "11px", fontWeight: bar.peak ? 800 : 600, color: bar.peak ? "#6546ed" : "#64748b", marginTop: "4px" }}>
                          {bar.day}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", fontSize: "11.5px", color: "#64748b" }}>
                    <span>Peak Study: <b>Saturday (8.0 hrs)</b></span>
                    <span>Daily Avg: <b>5.5 hrs/day</b></span>
                  </div>
                </div>

                {/* Widget C: Recent Lecture Quick Access */}
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "44px",
                      borderRadius: "8px",
                      backgroundImage: "url(https://img.youtube.com/vi/" + analyzedVideoId + "/hqdefault.jpg)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "grid",
                      placeItems: "center",
                      color: "white",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    ▶
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <small style={{ color: "#6546ed", fontWeight: 800, fontSize: "10.5px" }}>LAST ANALYZED LECTURE</small>
                    <h5 style={{ margin: "2px 0 0", fontSize: "13px", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {analyzedTitle}
                    </h5>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoToLecturePractice}
                    style={{
                      padding: "7px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#f0edff",
                      color: "#6546ed",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    20 MCQs →
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 2: STUDY PLAN (ALL CHAPTERS) ================= */}
        {activeTab === "Study Plan" && (
          <section className="sl-panel">
            <span className="sl-welcome-tag">✦ STEP-BY-STEP SYLLABUS ROADMAP</span>
            <h2>Complete Study Plan</h2>
            <p>Every single chapter in your syllabus with structured 4-step preparation milestones.</p>

            {/* Subject Selector Tabs */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
              {subjects.map((sub) => (
                <button
                  key={sub.name}
                  type="button"
                  onClick={() => setPlanSubject(sub.name)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: planSubject === sub.name ? `2px solid ${sub.accent}` : "1px solid #cbd5e1",
                    background: planSubject === sub.name ? sub.color : "white",
                    color: planSubject === sub.name ? "#0f172a" : "#64748b",
                    fontWeight: 700,
                    fontSize: "13.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>{sub.icon}</span>
                  {sub.name}
                </button>
              ))}
            </div>

            {/* Class Selector */}
            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              {["11", "12"].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setPlanClass(cls)}
                  style={{
                    padding: "7px 18px",
                    borderRadius: "8px",
                    border: planClass === cls ? "2px solid #6546ed" : "1px solid #cbd5e1",
                    background: planClass === cls ? "#f0edff" : "white",
                    color: planClass === cls ? "#6546ed" : "#64748b",
                    fontWeight: 700,
                    fontSize: "12.5px",
                    cursor: "pointer",
                  }}
                >
                  Class {cls}th
                </button>
              ))}
            </div>

            {/* Chapter List */}
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
                Showing {currentRoadmaps.length} Chapters for {planSubject} (Class {planClass}th)
              </span>

              {currentRoadmaps.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e9eaf2",
                    borderRadius: "14px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#6546ed", background: "#f0edff", padding: "2px 8px", borderRadius: "6px" }}>
                        CHAPTER {idx + 1}
                      </span>
                      <h3 style={{ margin: "4px 0 0", fontSize: "16px", color: "#17213a" }}>
                        {item.chapter}
                      </h3>
                    </div>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, background: "#f8fafc", padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      {item.duration}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "12px" }}>
                    {item.steps.map((st, stepIdx) => {
                      const stepKey = `${planSubject}_${planClass}_${idx}_${stepIdx}`;
                      const isDone = completedSteps[stepKey];

                      return (
                        <div
                          key={stepIdx}
                          onClick={() => toggleStepDone(stepKey)}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "10px",
                            border: isDone ? "1.5px solid #22c55e" : "1px solid #e2e8f0",
                            background: isDone ? "#f0fdf4" : "#fbfcfe",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <strong style={{ fontSize: "12.5px", color: isDone ? "#16a34a" : "#1e293b" }}>
                              {st.title}
                            </strong>
                            <span style={{ fontSize: "14px" }}>{isDone ? "✓" : "○"}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: "11.5px", color: "#64748b", lineHeight: 1.45 }}>
                            {st.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= TAB 3: YOUTUBE ANALYZER ================= */}
        {activeTab === "YouTube Analyzer" && (
          <section className="sl-panel">
            <span className="sl-welcome-tag">✦ YOUTUBE INTELLIGENCE</span>
            <h2>Analyze Video Lecture</h2>
            <p>Paste any YouTube lecture link to extract smart notes, formulas, and 20 practice questions.</p>

            <form
              onSubmit={handleLectureSubmit}
              style={{
                display: "flex",
                gap: "12px",
                margin: "20px 0",
                flexWrap: "wrap",
              }}
            >
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={lectureUrl}
                onChange={(e) => setLectureUrl(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: "260px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button type="submit" disabled={loading} style={primaryBtnStyle}>
                {loading ? "Analyzing Video..." : "Analyze Lecture →"}
              </button>
            </form>

            {message && (
              <p
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: message.includes("success") || message.includes("analyzed") ? "#f0fdf4" : "#fef2f2",
                  color: message.includes("success") || message.includes("analyzed") ? "#166534" : "#991b1b",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "20px",
                }}
              >
                {message}
              </p>
            )}

            {/* Video Player & Info Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  background: "#000",
                }}
              >
                {playEmbed ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube-nocookie.com/embed/${analyzedVideoId}?autoplay=1`}
                    title="Lecture Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(https://img.youtube.com/vi/${analyzedVideoId}/hqdefault.jpg)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => setPlayEmbed(true)}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: "rgba(101, 70, 237, 0.9)",
                        color: "white",
                        display: "grid",
                        placeItems: "center",
                        fontSize: "26px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      }}
                    >
                      ▶
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Metadata Strip */}
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "14px", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ margin: "0 0 6px", fontSize: "17px", color: "#0f172a" }}>
                      {analyzedTitle}
                    </h3>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "12.5px" }}>
                      {generated
                        ? "Analyzed with Gemini 3.0 Flash • Notes & 20 MCQs extracted"
                        : "Sample Video: Trigonometric Functions & Identites | JEE Main"}
                    </p>
                  </div>

                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: "#e0f2fe",
                      color: "#0369a1",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    ⚡ AI Ready
                  </span>
                </div>

                {/* Quick Action Navigation */}
                <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      background: "white",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    onClick={() => setActiveTab("AI Notes")}
                  >
                    ✎ View Smart Notes ({generated ? notesCount : 12}) →
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#6546ed",
                      color: "white",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    onClick={handleGoToLecturePractice}
                  >
                    🎯 Practice {generated ? activeQuestions.length : 20} MCQs →
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= TAB 4: AI NOTES ================= */}
        {activeTab === "AI Notes" && (
          <section className="sl-panel">
            <span className="sl-welcome-tag">✦ AI STUDY TOOLS</span>
            <h2>Turn lectures into study notes</h2>
            <p>Submit a YouTube lecture URL to generate notes.</p>

            <form className="sl-lecture-form" onSubmit={handleLectureSubmit}>
              <label htmlFor="lectureUrl">YouTube lecture URL</label>
              <input
                id="lectureUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={lectureUrl}
                onChange={(event) => setLectureUrl(event.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Generating notes..." : "Submit lecture →"}
              </button>
            </form>

            {message && (
              <p className="sl-message" role="status">
                {message}
              </p>
            )}

            {generated ? (
              <div className="sl-lecture-list" style={{ marginTop: "24px" }}>
                <h3>📝 Smart Notes ({notesCount})</h3>
                <ul style={{ lineHeight: 1.75, paddingLeft: "20px" }}>
                  {(generated.notes || []).map((note, i) => (
                    <li key={i} style={{ marginBottom: "8px" }}>
                      {note}
                    </li>
                  ))}
                </ul>

                <h3 style={{ marginTop: "24px" }}>
                  📐 Key Formulas ({formulasCount})
                </h3>
                <ul style={{ lineHeight: 1.75, paddingLeft: "20px" }}>
                  {(generated.formulas || []).map((formula, i) => (
                    <li key={i} style={{ marginBottom: "8px" }}>
                      {formula}
                    </li>
                  ))}
                </ul>

                <div
                  style={{
                    marginTop: "24px",
                    padding: "18px 22px",
                    borderRadius: "14px",
                    background: "linear-gradient(115deg, #f3f0ff, #eef6ff)",
                    border: "1px solid #e0d8ff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "14px", color: "#1e2640", display: "block" }}>
                      🎯 <b>{(generated.mcqs || []).length} Practice Questions</b> are ready!
                    </span>
                    <small style={{ color: "#6e7790", fontSize: "12px" }}>
                      Aligned with your analyzed lecture notes and formulas.
                    </small>
                  </div>

                  <button
                    type="button"
                    style={primaryBtnStyle}
                    onClick={handleGoToLecturePractice}
                  >
                    Start Practice →
                  </button>
                </div>
              </div>
            ) : (
              <div className="sl-empty-state" style={{ marginTop: "20px" }}>
                <span>📝</span>
                <h3>No lecture analyzed yet</h3>
                <p>Paste a YouTube URL above or use YouTube Analyzer to generate notes and MCQs.</p>
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 5: PRACTICE MCQS (20 QUESTIONS) ================= */}
        {activeTab === "Practice MCQs" && (
          <section className="sl-panel">
            <div style={{ marginBottom: "20px" }}>
              <span className="sl-welcome-tag">✦ TARGETED 20 MCQS PRACTICE</span>
              <h2>Practice MCQs (20 Questions)</h2>
              <p>Practice 20 high-yield exam questions generated from your AI Lecture notes or standard subject chapters.</p>
            </div>

            {/* Dynamic Banner: When questions are from analyzed lecture notes */}
            {useLectureQuestions && lectureMcqs.length > 0 ? (
              <div
                style={{
                  background: "linear-gradient(135deg, #eef2ff, #f0fdf4)",
                  border: "1.5px solid #818cf8",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  marginBottom: "22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.08)",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      background: "#4f46e5",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      display: "inline-block",
                      marginBottom: "6px",
                    }}
                  >
                    ⚡ LIVE AI LECTURE MCQS ({lectureMcqs.length} QUESTIONS)
                  </span>
                  <h3 style={{ margin: "2px 0 4px", fontSize: "16px", color: "#1e1b4b" }}>
                    Generated from: "{lectureTitle || analyzedTitle}"
                  </h3>
                  <p style={{ margin: 0, fontSize: "12.5px", color: "#4338ca" }}>
                    Subject: <b>{mcqSubject}</b> • Questions are 100% aligned with your analyzed smart notes and formulas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUseLectureQuestions(false);
                    setMcqBankQuestions(subjectQuestionBanks[mcqSubject] || default20PhysicsQuestions);
                    setMcqBankAnswers({});
                    setShowExplanation({});
                  }}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "9px",
                    border: "1.5px solid #c7d2fe",
                    background: "white",
                    color: "#4338ca",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  Switch to Standard {mcqSubject} Bank →
                </button>
              </div>
            ) : null}

            {/* Filter Bar */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginBottom: "20px",
                alignItems: "flex-end",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#64748b" }}>Subject</label>
                <select
                  value={mcqSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  style={{
                    padding: "9px 13px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    fontWeight: 600,
                  }}
                >
                  {subjects.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#64748b" }}>Class</label>
                <select
                  value={mcqClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  style={{
                    padding: "9px 13px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    fontWeight: 600,
                  }}
                >
                  <option value="11">Class 11th</option>
                  <option value="12">Class 12th</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "240px" }}>
                <label style={{ fontSize: "11.5px", fontWeight: 700, color: "#64748b" }}>
                  Chapter ({chapterRoadmapData[mcqSubject]?.[mcqClass]?.length || 0} Total)
                </label>
                
<select
  value={mcqChapter}
  onChange={(e) => handleChapterChange(e.target.value)}
                  style={{
                    padding: "9px 13px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    fontWeight: 600,
                  }}
                >
                  {(chapterRoadmapData[mcqSubject]?.[mcqClass] || []).map((ch, i) => (
                    <option key={i} value={ch.chapter}>
                      {ch.chapter}
                    </option>
                  ))}
                </select>
              </div>

              {/* If user previously analyzed a lecture, show quick button to return to lecture questions */}
              {lectureMcqs.length > 0 && !useLectureQuestions && (
                <button
                  type="button"
                  onClick={handleGoToLecturePractice}
                  style={{
                    padding: "9px 14px",
                    borderRadius: "8px",
                    border: "1px solid #818cf8",
                    background: "#eef2ff",
                    color: "#4f46e5",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    height: "38px",
                  }}
                >
                  ⚡ View Analyzed Lecture MCQs ({lectureMcqs.length})
                </button>
              )}
            </div>

            {/* Score Strip */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f1f5f9",
                padding: "12px 18px",
                borderRadius: "10px",
                fontSize: "13.5px",
                marginBottom: "20px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <span>Attempted: <b>{bankAttempted} / {mcqBankQuestions.length}</b></span>
                <span>Score: <b style={{ color: "#16a34a" }}>{bankCorrect} Correct</b></span>
                <span>
                  Accuracy: <b style={{ color: "#6546ed" }}>{bankAttempted > 0 ? Math.round((bankCorrect / bankAttempted) * 100) : 0}%</b>
                </span>
              </div>

              {bankAttempted > 0 && (
                <button
                  type="button"
                  onClick={handleResetBank}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ↺ Reset Quiz
                </button>
              )}
            </div>

            {/* Question Stream (20 Questions) */}
            {loadingQuestions ? (
              <p style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>Loading questions...</p>
            ) : (
              <div>
                {mcqBankQuestions.map((q, idx) => {
                  const selected = mcqBankAnswers[q._id];
                  const hasAnswered = !!selected;
                  const isCorrect = selected === q.answer;

                  return (
                    <article
                      key={q._id || idx}
                      style={{
                        border: hasAnswered ? (isCorrect ? "1.5px solid #86efac" : "1.5px solid #fca5a5") : "1px solid #eceef5",
                        background: hasAnswered ? (isCorrect ? "#f0fdf4" : "#fef2f2") : "#ffffff",
                        borderRadius: "14px",
                        padding: "18px",
                        marginBottom: "16px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "6px" }}>
                        <span style={{ fontWeight: 800, fontSize: "13px", color: "#6546ed" }}>
                          Question #{idx + 1} of {mcqBankQuestions.length}
                        </span>
                        <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#64748b", background: "#f8fafc", padding: "2px 8px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                          {q.difficulty || "Standard"} {q.examTag && `• ${q.examTag}`}
                        </span>
                      </div>

                      <p style={{ margin: "0 0 14px", fontSize: "14.5px", fontWeight: 600, color: "#0f172a", lineHeight: 1.5 }}>
                        {q.question}
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                        {(q.options || []).map((opt, optIdx) => {
                          let optBg = "#ffffff";
                          let optColor = "#1e293b";
                          let optBorder = "1px solid #cbd5e1";

                          if (hasAnswered) {
                            if (opt === q.answer) {
                              optBg = "#22c55e";
                              optColor = "#ffffff";
                              optBorder = "1px solid #16a34a";
                            } else if (opt === selected) {
                              optBg = "#ef4444";
                              optColor = "#ffffff";
                              optBorder = "1px solid #dc2626";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                if (!hasAnswered) {
                                  setMcqBankAnswers((prev) => ({
                                    ...prev,
                                    [q._id]: opt,
                                  }));
                                }
                              }}
                              style={{
                                padding: "12px 14px",
                                borderRadius: "8px",
                                border: optBorder,
                                background: optBg,
                                color: optColor,
                                textAlign: "left",
                                fontSize: "13px",
                                fontWeight: hasAnswered && (opt === q.answer || opt === selected) ? 700 : 500,
                                cursor: hasAnswered ? "default" : "pointer",
                                transition: "all 0.15s",
                              }}
                            >
                              <b style={{ marginRight: "8px" }}>
                                {String.fromCharCode(65 + optIdx)})
                              </b>{" "}
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div style={{ marginTop: "12px" }}>
                          <button
                            type="button"
                            onClick={() =>
                              setShowExplanation((prev) => ({
                                ...prev,
                                [q._id]: !prev[q._id],
                              }))
                            }
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#6546ed",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            {showExplanation[q._id] ? "▲ Hide Explanation" : "💡 Show Explanation"}
                          </button>

                          {showExplanation[q._id] && (
                            <div
                              style={{
                                marginTop: "8px",
                                padding: "12px 14px",
                                background: "#f8fafc",
                                borderLeft: "3px solid #6546ed",
                                borderRadius: "4px",
                                fontSize: "12.5px",
                                color: "#334155",
                                lineHeight: 1.6,
                              }}
                            >
                              <b>Correct Answer:</b> {q.answer}
                              <br />
                              <b>Explanation:</b> {q.explanation || "Directly aligned with key principles and formulas covered in this chapter."}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 6: MY PROGRESS ================= */}
        {activeTab === "My Progress" && (
          <section className="sl-panel">
            <span className="sl-welcome-tag">✦ REAL-TIME PROGRESS & MASTERY</span>
            <h2>Academic Progress</h2>
            <p>Track your chapter-wise roadmaps, attempted MCQs, and subject mastery percentage.</p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "18px",
                marginTop: "20px",
              }}
            >
              {subjects.map((sub) => {
                const totalChapters =
                  (chapterRoadmapData[sub.name]?.["11"]?.length || 0) +
                  (chapterRoadmapData[sub.name]?.["12"]?.length || 0);

                const completedInSubject = Object.keys(completedSteps).filter((k) =>
                  k.startsWith(`${sub.name}_`) && completedSteps[k]
                ).length;

                const percent = Math.min(
                  100,
                  Math.round((completedInSubject / Math.max(1, totalChapters * 4)) * 100)
                );

                return (
                  <div
                    key={sub.name}
                    style={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "20px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "20px", padding: "8px", background: sub.color, borderRadius: "10px" }}>
                        {sub.icon}
                      </span>
                      <strong style={{ fontSize: "15px", color: sub.accent }}>
                        {percent}% Done
                      </strong>
                    </div>

                    <h4 style={{ margin: "0 0 4px", fontSize: "16px", color: "#17213a" }}>
                      {sub.name}
                    </h4>
                    <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#64748b" }}>
                      {totalChapters} Total Chapters Across Class 11 & 12
                    </p>

                    <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: sub.accent,
                          borderRadius: "10px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Practice Recap */}
            <div
              style={{
                marginTop: "24px",
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: "16px", color: "#17213a" }}>
                MCQ Practice Summary
              </h3>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "12px" }}>
                <div>
                  <small style={{ color: "#64748b", fontSize: "12px" }}>Attempted Questions</small>
                  <h3 style={{ margin: "4px 0 0", color: "#0f172a" }}>
                    {bankAttempted > 0 ? bankAttempted : answeredCount}
                  </h3>
                </div>
                <div>
                  <small style={{ color: "#64748b", fontSize: "12px" }}>Correct Solutions</small>
                  <h3 style={{ margin: "4px 0 0", color: "#16a34a" }}>
                    {bankCorrect > 0 ? bankCorrect : score}
                  </h3>
                </div>
                <div>
                  <small style={{ color: "#64748b", fontSize: "12px" }}>Overall Accuracy</small>
                  <h3 style={{ margin: "4px 0 0", color: "#6546ed" }}>
                    {bankAttempted > 0
                      ? `${Math.round((bankCorrect / bankAttempted) * 100)}%`
                      : mcqSubmitted
                      ? `${accuracyPercent}%`
                      : "—"}
                  </h3>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}