package com.app.flatmate.model;

import jakarta.persistence.*;

@Entity
@Table(name = "preferences")
public class Preference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "sleep_cycle")
    private SleepCycle sleepCycle;

    @Column(name = "cleanliness")
    private Integer cleanliness;

    private Boolean smoking;
    private Boolean drinking;

    @Column(name = "budget_min")
    private Integer budgetMin;

    @Column(name = "budget_max")
    private Integer budgetMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_preference")
    private FoodPreference foodPreference;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_type")
    private WorkType workType;

    @Column(name = "guests_frequency")
    private Integer guestsFrequency;

    private String city;

    public Preference() {}

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public SleepCycle getSleepCycle() { return sleepCycle; }
    public void setSleepCycle(SleepCycle sleepCycle) { this.sleepCycle = sleepCycle; }
    public Integer getCleanliness() { return cleanliness; }
    public void setCleanliness(Integer cleanliness) { this.cleanliness = cleanliness; }
    public Boolean getSmoking() { return smoking; }
    public void setSmoking(Boolean smoking) { this.smoking = smoking; }
    public Boolean getDrinking() { return drinking; }
    public void setDrinking(Boolean drinking) { this.drinking = drinking; }
    public Integer getBudgetMin() { return budgetMin; }
    public void setBudgetMin(Integer budgetMin) { this.budgetMin = budgetMin; }
    public Integer getBudgetMax() { return budgetMax; }
    public void setBudgetMax(Integer budgetMax) { this.budgetMax = budgetMax; }
    public FoodPreference getFoodPreference() { return foodPreference; }
    public void setFoodPreference(FoodPreference foodPreference) { this.foodPreference = foodPreference; }
    public WorkType getWorkType() { return workType; }
    public void setWorkType(WorkType workType) { this.workType = workType; }
    public Integer getGuestsFrequency() { return guestsFrequency; }
    public void setGuestsFrequency(Integer guestsFrequency) { this.guestsFrequency = guestsFrequency; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}
